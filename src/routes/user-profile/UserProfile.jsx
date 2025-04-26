import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import { faAddressCard, faHotel, faTags, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import { networkAdapter } from 'services/NetworkAdapter';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';
import BookingPanel from './components/BookingPanel';
import PromotionsPanel from './components/PromotionsPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserProfile = () => {
  const { userDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const { section } = useParams();
  const activeKey = section || 'personal';

  const wrapperRef = useRef();
  const buttonRef = useRef();
  const [isTabsVisible, setIsTabsVisible] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const fetchUserData = useCallback(async () => {
    if (!userDetails) return;
    try {
      const response = await networkAdapter.get('/api/user', { id: userDetails.id });
      if (response.status === 'success') {
        setUserBookings(response.data.reservations);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, [userDetails]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await networkAdapter.delete(`/api/hotel/cancel/${bookingId}`);
      await fetchUserData();
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  // Build tab panels
  const tabPanels = [];
  if (userDetails?.admin) {
    tabPanels.push(
      <TabPanel key="analytics" eventKey="analytics" label="Analytics" icon={faChartLine}>
        <AnalyticsDashboard />
      </TabPanel>
    );
  }
  tabPanels.push(
    <TabPanel key="personal" eventKey="personal" label="Personal Details" icon={faAddressCard}>
      <ProfileDetailsPanel userDetails={userDetails} />
    </TabPanel>
  );
  tabPanels.push(
    <TabPanel key="bookings" eventKey="bookings" label="Bookings" icon={faHotel}>
      <BookingPanel bookings={userBookings} onCancelBooking={handleCancelBooking} />
    </TabPanel>
  );
  if (userDetails?.admin) {
    tabPanels.push(
      <TabPanel key="promotions" eventKey="promotions" label="Promotions" icon={faTags}>
        <PromotionsPanel />
      </TabPanel>
    );
  }

  return (
    <div className="container mx-auto p-4 my-10 min-h-[530px]">
      <div className="mx-4">
        <button
          ref={buttonRef}
          onClick={() => setIsTabsVisible(!isTabsVisible)}
          className="block md:hidden items-center px-4 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <FontAwesomeIcon icon={isTabsVisible ? faXmark : faBars} size="lg" />
        </button>
      </div>
      <Tabs
        activeKey={activeKey}
        onSelect={(key) => navigate(`/user-profile/${key}`)}
        isTabsVisible={isTabsVisible}
        wrapperRef={wrapperRef}
      >
        {tabPanels}
      </Tabs>
    </div>
  );
};

export default UserProfile;
