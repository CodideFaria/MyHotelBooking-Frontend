import React, { useState, useEffect, useRef, useContext } from 'react';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentMethodsPanel from './components/PaymentsMethodsPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import BookingPanel from './components/BookingPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';

const UserProfile = () => {
  const { userDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const wrapperRef = useRef();
  const buttonRef = useRef();

  const [isTabsVisible, setIsTabsVisible] = useState(false);

  // Local state for bookings and payment methods pulled from userDetails
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

  // Redirect to login if userDetails are not available
  useEffect(() => {
    if (!userDetails) {
      navigate('/login');
    }
  }, [navigate, userDetails]);

  // When userDetails change, update bookings and payment methods
  useEffect(() => {
    if (userDetails) {
      setUserBookings(userDetails.reservations || []);
      setUserPaymentMethods(userDetails.payment_details || []);
    }
  }, [userDetails]);

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
        <TabPanel label="Personal Details" icon={faAddressCard}>
          <ProfileDetailsPanel userDetails={userDetails} />
        </TabPanel>
        <TabPanel label="Bookings" icon={faHotel}>
          <BookingPanel bookings={userBookings} />
        </TabPanel>
        <TabPanel label="Payment details" icon={faCreditCard}>
          <PaymentMethodsPanel
            userPaymentMethodsData={{
              isLoading: false,
              data: userPaymentMethods,
              errors: [],
            }}
            setUserPaymentMethodsData={setUserPaymentMethods}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default UserProfile;
