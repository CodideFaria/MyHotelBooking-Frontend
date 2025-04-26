import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useRef, useEffect } from 'react';

/**
 * Represents the booking confirmation component.
 * @component
 * @returns {JSX.Element} The booking confirmation component.
 */
const BookingConfirmation = () => {
  // Router navigation
  const navigate = useNavigate();

  // Extract token from query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const contentToPrint = useRef(null);

  /**
   * Confirm booking on component mount using the token from URL query.
   */
  useEffect(() => {
    const confirmBooking = async () => {
      try {
        if (!token) {
          console.error('No token provided in URL query');
          return;
        }
        await networkAdapter.get(`/api/hotel/confirm/${token}`);
        // Optionally handle response or update state here
      } catch (error) {
        console.error('Error confirming booking:', error);
      }
    };

    confirmBooking();
  }, [token]);

  /**
   * Handles the print event.
   * @function
   * @returns {void}
   */
  const handlePrint = useReactToPrint({
    documentTitle: 'Booking Confirmation',
    removeAfterPrint: true,
  });

  return (
    <div className="md:mx-auto max-w-[800px] my-40">
      <div className="flex justify-between mx-2 rounded-md my-2">
        <Link
          to="/"
          className="border p-2 min-w-[120px] text-center transition-all delay-100 hover:bg-brand hover:text-white"
        >
          Back to home
        </Link>

        {/* Print and Go to Bookings buttons grouped together */}
        <div className="flex space-x-2">
          <button
            onClick={() => handlePrint(null, () => contentToPrint.current)}
            className="border p-2 min-w-[120px] transition-all delay-75 hover:bg-brand hover:text-white hover:animate-bounce"
          >
            Print
          </button>
          <button
            onClick={() => navigate('/user-profile/bookings')}
            className="border p-2 min-w-[120px] transition-all delay-75 hover:bg-brand hover:text-white hover:animate-bounce"
          >
            Go to Bookings
          </button>
        </div>
      </div>

      <div
        ref={contentToPrint}
        className="flex mx-2  px-4 py-12 items-center justify-center flex-col border rounded-md"
      >
        <div className="flex items-center justify-center mb-2">
          <FontAwesomeIcon icon={faStar} className="text-brand text-xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-4xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-brand text-xl" />
        </div>
        <h1 className="text-gray-700 text-2xl font-bold">Booking Confirmed</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your booking! Your reservation has been confirmed.
        </p>
        <p className="text-gray-600">
          Please check your email for the booking details and instructions for
          your stay.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
