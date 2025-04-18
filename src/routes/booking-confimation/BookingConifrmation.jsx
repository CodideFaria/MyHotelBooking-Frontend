import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

/**
 * Represents the booking confirmation component.
 * @component
 * @returns {JSX.Element} The booking confirmation component.
 */
const BookingConfirmation = () => {
  const contentToPrint = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);

  /**
   * Handles the print event.
   * @function
   * @returns {void}
   */
  const handlePrint = useReactToPrint({
    documentTitle: 'Booking Confirmation',
    removeAfterPrint: true,
  });

  // Set booking details from location state passed from the previous page(checkout page)
  useEffect(() => {
    if (location.state) {
      const { bookingDetails } = location.state.confirmationData;
    //   {
    //     "id": "21712cd0-b823-4bb3-a2ec-83ae1e752189",
    //     "check_in": "2025-04-20",
    //     "check_out": "2025-04-21",
    //     "status": "booked",
    //     "total_price": 33.6,
    //     "created_at": "2025-04-17 16:25:19.072354",
    //     "updated_at": "2025-04-17 16:25:19.072364",
    //     "room": {
    //         "id": "5545a0b1-f94c-494f-9246-7f34b490be71",
    //         "description": "Deluxe Guest room",
    //         "room_number": 101,
    //         "room_type": "Deluxe",
    //         "capacity": 2,
    //         "price": 15,
    //         "is_available": true
    //     }
    // }
      setBookingDetails(bookingDetails);
    } else {
      navigate('/');
    }
  }, [bookingDetails, location.state, navigate]);

  return (
    <div className="md:mx-auto max-w-[800px] my-40">
      <div className="flex justify-between mx-2 rounded-md my-2">
        <Link
          to="/"
          className={`border p-2 min-w-[120px] text-center transition-all delay-100 hover:bg-brand hover:text-white`}
        >
          Back to home
        </Link>
        <button
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
          className="border p-2 min-w-[120px] transition-all delay-75 hover:bg-gray-500 hover:text-white hover:animate-bounce"
        >
          Print
        </button>
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
        <div className="mt-4 flex justify-center flex-wrap items-center">
          {bookingDetails &&
            bookingDetails.map((detail, index) => (
              <div key={index} className="border-r-2 px-4">
                <p className="text-gray-600 text-sm">{detail.label}</p>
                <span className="text-gray-600 text-sm font-bold">
                  {detail.value}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default BookingConfirmation;
