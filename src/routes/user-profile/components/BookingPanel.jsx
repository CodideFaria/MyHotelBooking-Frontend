import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialBookings = [
  {
    hotelName: 'Brussels Marriott Hotel Grand Place',
    roomName: 'Deluxe Guest room',
    bookingId: 'GLH12345',
    bookingDate: '2025-04-10',
    checkInDate: '2025-05-01',
    checkOutDate: '2025-05-05',
    totalFare: '€520.00',
  },
  {
    hotelName: 'DoubleTree by Hilton Zagreb',
    roomName: 'Superior Room',
    bookingId: 'PRI67890',
    bookingDate: '2025-04-12',
    checkInDate: '2025-06-15',
    checkOutDate: '2025-06-20',
    totalFare: '€340.00',
  },
  {
    hotelName: 'Hyatt Regency Baku',
    roomName: 'Deluxe Studio',
    bookingId: 'ABR24680',
    bookingDate: '2025-04-14',
    checkInDate: '2025-07-10',
    checkOutDate: '2025-07-15',
    totalFare: '€780.00',
  },
];

const BookingPanel = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [confirmBookingId, setConfirmBookingId] = useState(null);

  const requestCancel = (id) => {
    setConfirmBookingId(id);
  };

  const cancelBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== id));
    setConfirmBookingId(null);
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {bookings.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            You have no bookings yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {bookings.map((booking) => (
                <motion.li
                  key={booking.bookingId}
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
                          {booking.hotelName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {booking.roomName}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Booking ID: {booking.bookingId}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex gap-x-2">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-4 4V3m0 4v8m-4-4h8"
                            />
                          </svg>
                          Booking Date: {booking.bookingDate}
                        </p>
                        <p className="flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 10l5 5 5-5m-5 5V3"
                            />
                          </svg>
                          Check‑in: {booking.checkInDate}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 10l5 5 5-5m-5 5V3"
                            />
                          </svg>
                          Check‑out: {booking.checkOutDate}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p className="flex items-center">
                          <span className="font-medium">Total Fare: </span>
                          <span className="ml-2">{booking.totalFare}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => requestCancel(booking.bookingId)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Cancel Booking</h2>
            <p className="mb-6">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => cancelBooking(confirmBookingId)}
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