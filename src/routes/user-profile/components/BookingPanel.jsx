import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';

/**
 * BookingPanel displays a list of user bookings and allows cancellation.
 * Shows "Expired" status when the check-out date is in the past.
 * Hides cancel option for cancelled or expired bookings.
 */
const BookingPanel = ({ bookings = [], onCancelBooking }) => {
  const [localBookings, setLocalBookings] = useState([]);
  const [confirmBookingId, setConfirmBookingId] = useState(null);

  useEffect(() => {
    // Sort incoming bookings by created_at descending (newest first)
    const sorted = [...bookings].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setLocalBookings(sorted);
  }, [bookings]);

  const requestCancel = (id) => setConfirmBookingId(id);
  const confirmCancel = () => {
    if (confirmBookingId) {
      onCancelBooking(confirmBookingId);
      setConfirmBookingId(null);
    }
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

  // Extend badge mapping to include 'expired'
  const getBadge = (status) => {
    const mapping = {
      booked: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-800' },
      cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800' },
      'pending payment': { label: 'Pending Payment', bg: 'bg-yellow-100', text: 'text-yellow-800' },
      expired: { label: 'Expired', bg: 'bg-gray-100', text: 'text-gray-500' }
    };
    return mapping[status] || mapping.booked;
  };

  const now = new Date();

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {localBookings.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            You have no bookings yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {localBookings.map((booking) => {
                const checkIn = new Date(booking.check_in);
                const checkOut = new Date(booking.check_out);
                const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

                // Override status to 'expired' if it's checked out already and not cancelled
                const effectiveStatus =
                  booking.status !== 'cancelled' && checkOut < now
                    ? 'expired'
                    : booking.status;

                const bBadge = getBadge(effectiveStatus);

                return (
                  <motion.li
                    key={booking.id}
                    className="bg-white hover:bg-gray-50 relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                    layout
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-brand truncate">
                            Room #{booking.room.room_number}: {booking.room.description}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Type: {booking.room.room_type} &middot; Capacity: {booking.room.capacity} &middot; {nights} night{nights > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                          <span
                            title="Click to copy booking ID"
                            onClick={() => navigator.clipboard.writeText(booking.id)}
                            className={`cursor-pointer ${bBadge.bg} ${bBadge.text} px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
                          >
                            {bBadge.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between sm:items-center">
                        <div className="sm:flex sm:space-x-4">
                          <p className="flex items-center text-sm text-gray-500">
                            <FontAwesomeIcon icon={faArrowRight} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            Check-in: {checkIn.toLocaleDateString()}
                          </p>
                          <p className="flex items-center text-sm text-gray-500">
                            <FontAwesomeIcon icon={faArrowRight} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 rotate-180" />
                            Check-out: {checkOut.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span className="font-medium">Total:</span>
                          <span className="ml-2">{formatPrice(booking.total_price)}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        {effectiveStatus !== 'cancelled' && effectiveStatus !== 'expired' && (
                          <button
                            onClick={() => requestCancel(booking.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {confirmBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Cancel Booking</h2>
            <p className="mb-6">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setConfirmBookingId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPanel;