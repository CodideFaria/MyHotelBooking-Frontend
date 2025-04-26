import React, { useEffect, useState, useContext } from 'react';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getReadableMonthFormat } from 'utils/date-helpers';
import { AuthContext } from 'contexts/AuthContext';
import { networkAdapter } from 'services/NetworkAdapter';
import Loader from 'components/ux/loader/loader';
import Toast from 'components/ux/toast/Toast';

/**
 * Checkout component for initiating Stripe Checkout sessions and collecting user information.
 *
 * @returns {JSX.Element} The rendered Checkout component.
 */
const Checkout = () => {
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dismissToast = () => setToastMessage('');

  // Form state for collecting user email and address information
  const [formData, setFormData] = useState({
    email: userDetails?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Format the check-in and check-out dates
  const checkInDateTime = getReadableMonthFormat(searchParams.get('checkIn'));
  const checkOutDateTime = getReadableMonthFormat(searchParams.get('checkOut'));

  useEffect(() => {
    const locationState = location.state;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (!locationState || !checkIn || !checkOut) {
      const hotelCode = searchParams.get('hotelCode');
      navigate(`/hotel/${hotelCode}`);
    }
  }, [location, navigate, searchParams]);

  /**
   * Handle form input changes and validate the input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const isValid = validationSchema[name]?.(value) ?? true;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: !isValid });
  };

  /**
   * Handle form submission, create booking, then initiate Stripe Checkout.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const valid = validationSchema[field]?.(formData[field]) ?? true;
      newErrors[field] = !valid;
      isValid = isValid && valid;
    });
    setErrors(newErrors);
    if (!isValid) return;

    setIsSubmitDisabled(true);
    setIsLoading(true);

    try {
      const hotelId = searchParams.get('hotelCode');
      const roomId = location.state?.roomId;
      const roomType = location.state?.roomType;
      const check_in = searchParams.get('checkIn');
      const check_out = searchParams.get('checkOut');
      const nights = location.state?.nights;
      const totalRaw = location.state?.total;

      // 1. Create booking
      const bookRes = await networkAdapter.post('/api/hotel/book', {
        hotel_id: hotelId,
        room_id: roomId,
        check_in,
        check_out,
        total_price: totalRaw,
        customer_email: formData.email,
      });

      if (bookRes.status !== 'success') {
        throw new Error(bookRes.message || 'Booking failed');
      }

      // 2. Initiate Stripe Checkout session
      const sessionResponse = await networkAdapter.post('/api/payments/create-checkout-session', {
        bookingId: bookRes.data.id,
        amount: totalRaw,
        hotel_id: hotelId,
        room_type: roomType,
        email: formData.email,
        nights,
      });

      if (sessionResponse.url) {
        window.location.href = sessionResponse.url;
      } else {
        throw new Error(sessionResponse.message || 'Failed to start payment session');
      }
    } catch (err) {
      console.error(err);
      setToastMessage(err.message || 'Something went wrong. Please try again.');
      setIsSubmitDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <FinalBookingSummary
        hotelName={searchParams.get('hotelName').replaceAll('-', ' ')}
        checkIn={checkInDateTime}
        checkOut={checkOutDateTime}
        isAuthenticated={isAuthenticated}
        phone={userDetails?.phone}
        email={formData.email}
        fullName={userDetails?.fullName}
      />

      <div className="relative bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
        {isLoading && (
          <Loader isFullScreen loaderText="Processing, please wait..." />
        )}

        <form onSubmit={handleSubmit} className={`${isLoading ? 'opacity-40' : ''}`}>
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            error={errors.email}
          />

          <InputField
            label="Street address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address"
            required
            error={errors.address}
          />

          <InputField
            label="City"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
            error={errors.city}
          />

          <div className="flex mb-4 justify-between">
            <InputField
              label="State / Province"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              required
              error={errors.state}
            />
            <InputField
              label="Postal code"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              required
              error={errors.postalCode}
            />
          </div>

          <button
            className={`bg-brand hover:bg-brand-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ${
              isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={isSubmitDisabled}
          >
            Pay €{location.state?.total}
          </button>
        </form>

        {toastMessage && (
          <div className="my-4">
            <Toast message={toastMessage} type="error" dismissError={dismissToast} />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Generic Input field component for collecting user information.
 */
const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-invalid={error}
      className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    />
    {error && <p className="text-red-500 text-xs my-1">Please check this field.</p>}
  </div>
);

// Validation schema for form fields
const validationSchema = {
  email: (value) => /\S+@\S+\.\S+/.test(value),
  address: (value) => value.trim() !== '',
  city: (value) => value.trim() !== '',
  state: (value) => value.trim() !== '',
  postalCode: (value) => /^\d{5}(-\d{4})?$/.test(value),
};

export default Checkout;
