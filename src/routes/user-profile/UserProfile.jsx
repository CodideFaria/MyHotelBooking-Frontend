import React, { useState, useEffect, useRef, useContext } from 'react';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
  faCreditCard,
  faTags,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import { networkAdapter } from 'services/NetworkAdapter';
import PaymentMethodsPanel from './components/PaymentsMethodsPanel';
import PromotionsPanel from './components/PromotionsPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import BookingPanel from './components/BookingPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';

const UserProfile = () => {
  const { userDetails } = useContext(AuthContext);

  const wrapperRef = useRef();
  const buttonRef = useRef();

  const [isTabsVisible, setIsTabsVisible] = useState(false);

  // keep loading/error if you want to show spinners/errors
  const [userBookings, setUserBookings] = useState([]);
  const [userPaymentMethods, setUserPaymentMethods] = useState([]);

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible(!isTabsVisible);
  };

  /* ---------------------------- Fetch user data ---------------------------- */
  useEffect(() => {
    if (!userDetails) return;

    const fetchUserData = async () => {
      try {
        const response = await networkAdapter.get('/api/user', { id: userDetails.id });

        if (response.status === 'success') {
          setUserBookings(response.data.reservations);
          setUserPaymentMethods(response.data.payment_details || []);
        } else {
          console.error('Unexpected GET /api/user response:', response);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [userDetails]);

  /* ------------------------------ Build tabs ------------------------------- */
  const tabPanels = [];

  if (userDetails?.admin) {
    tabPanels.push(
      <TabPanel key="analytics" label="Analytics" icon={faChartLine}>
        <AnalyticsDashboard />
      </TabPanel>
    );
  }

  tabPanels.push(
    <TabPanel key="personal" label="Personal Details" icon={faAddressCard}>
      <ProfileDetailsPanel userDetails={userDetails} />
    </TabPanel>
  );

  tabPanels.push(
    <TabPanel key="bookings" label="Bookings" icon={faHotel}>
      <BookingPanel bookings={userBookings} />
    </TabPanel>
  );

  tabPanels.push(
    <TabPanel key="payments" label="Payment details" icon={faCreditCard}>
      <PaymentMethodsPanel
        userPaymentMethodsData={{
          isLoading: false,
          data: userPaymentMethods,
          errors: [],
        }}
        setUserPaymentMethodsData={setUserPaymentMethods}
      />
    </TabPanel>
  );

  if (userDetails?.admin) {
    tabPanels.push(
      <TabPanel key="promotions" label="Promotions" icon={faTags}>
        <PromotionsPanel />
      </TabPanel>
    );
  }

  /* ------------------------------ Render page ------------------------------ */
  return (
    <div className="container mx-auto p-4 my-10 min-h-[530px]">
      <div className="mx-4">
        <button
          ref={buttonRef}
          onClick={onTabsMenuButtonAction}
          className="block md:hidden items-center px-4 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <FontAwesomeIcon icon={isTabsVisible ? faXmark : faBars} size="lg" />
        </button>
      </div>
      <Tabs isTabsVisible={isTabsVisible} wrapperRef={wrapperRef}>
        {tabPanels}
      </Tabs>
    </div>
  );
};

export default UserProfile;
