import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays } from 'date-fns';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import { networkAdapter } from 'services/NetworkAdapter';
import { DEFAULT_TAX_DETAILS } from 'utils/constants';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { formatPrice } from 'utils/price-helpers';
import Toast from 'components/ux/toast/Toast';
import format from 'date-fns/format';

/**
 * A component that displays the booking details for a hotel, including date range, room type, and pricing.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.hotelCode - The unique code for the hotel.
 */
const HotelBookingDetailsCard = ({ hotelCode }) => {
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  // Local states for room selection and booking details
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState({
    value: 2,
    label: '2 guests',
  });
  const [selectedRooms, setSelectedRooms] = useState({
    value: 1,
    label: '1 room',
  });

  // Pricing states
  const [total, setTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [bookingPeriodDays, setBookingPeriodDays] = useState(1);

  // Booking details from API: cancellation policy, rooms, etc.
  const [bookingDetails, setBookingDetails] = useState({});
  const [roomOptions, setRoomOptions] = useState([]);

  // Fallback values for guest and room count options.
  const guestOptions = Array.from(
    { length: bookingDetails.maxGuestsAllowed || 4 },
    (_, i) => ({ value: i + 1, label: `${i + 1} guest${i > 0 ? 's' : ''}` })
  );
  const roomNumberOptions = Array.from(
    { length: bookingDetails.maxRoomsAllowedPerGuest || 2 },
    (_, i) => ({ value: i + 1, label: `${i + 1} room${i > 0 ? 's' : ''}` })
  );

  // Handler when room type selection changes.
  const handleRoomTypeChange = (selectedOption) => {
    setSelectedRoom(selectedOption);
    calculatePrices();
  };

  const handleGuestsNumberChange = (selectedOption) => {
    setSelectedGuests(selectedOption);
  };

  const handleRoomsNumberChange = (selectedOption) => {
    setSelectedRooms(selectedOption);
    calculatePrices();
  };

  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  /**
   * When the date range changes, update the booking period and recalculate prices.
   */
  const onDateChangeHandler = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    const days =
      startDate && endDate
        ? differenceInCalendarDays(endDate, startDate) + 1
        : 1;
    setBookingPeriodDays(days);
    calculatePrices();
  };

  /**
   * Recalculates the total price and taxes based on the selected room’s price,
   * number of rooms and the duration of the stay.
   */
  const calculatePrices = () => {
    if (!selectedRoom || !selectedRooms.value) return;

    const pricePerNight = selectedRoom.price * selectedRooms.value;
    let gstRate = 0.12;

    if (pricePerNight > 75) {
      gstRate = 0.18;
    } else if (pricePerNight > 25) {
      gstRate = 0.15;
    }

    const totalGst = (pricePerNight * bookingPeriodDays * gstRate).toFixed(2);
    const totalPrice = (
      pricePerNight * bookingPeriodDays +
      parseFloat(totalGst)
    ).toFixed(2);

    if (!isNaN(totalPrice)) {
      setTotal(formatPrice(totalPrice));
    }
    setTaxes(formatPrice(totalGst));
  };

  /**
   * Confirm the booking. Validates that both check-in and check-out dates are selected.
   */
  const onBookingConfirm = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      return;
    }
    const checkIn = format(dateRange[0].startDate, 'dd-MM-yyyy');
    const checkOut = format(dateRange[0].endDate, 'dd-MM-yyyy');
    const queryParams = {
      hotelCode,
      checkIn,
      checkOut,
      guests: selectedGuests.value,
      rooms: selectedRooms.value,
      hotelName: selectedRoom.label ? selectedRoom.label.replaceAll(' ', '-') : '',
    };

    const url = `/checkout?${queryString.stringify(queryParams)}`;
    navigate(url, {
      state: {
        total,
        checkInTime: bookingDetails.checkInTime,
        checkOutTime: bookingDetails.checkOutTime,
        roomId: selectedRoom.id
      },
    });
  };

  // Dismiss error messages.
  const dismissError = () => {
    setErrorMessage('');
  };

  // Recalculate pricing when relevant dependencies change.
  useEffect(() => {
    calculatePrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingPeriodDays, selectedRooms, selectedRoom]);

  /**
   * Fetch booking enquiry data that contains both the list of available rooms and the cancellation policy.
   */
  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const response = await networkAdapter.get(`/api/hotel/${hotelCode}/booking/enquiry`);
        if (response && response.data) {
          // Set booking details (including cancellation policy).
          setBookingDetails(response.data);

          // Extract available rooms from response data.
          const availableRooms = response.data.rooms.filter(room => room.is_available);
          const options = availableRooms.map(room => ({
            value: room.id,
            label: room.description, // you can append room type or room number if desired
            price: room.price,
            id: room.id,
          }));
          setRoomOptions(options);
          if (options.length > 0 && !selectedRoom) {
            setSelectedRoom(options[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching booking enquiry data:', error);
        setErrorMessage('Unable to load booking details. Please try again.');
      }
    };
    getBookingDetails();
  }, [hotelCode]);

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Booking Details</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        {/* Total Price & Cancellation Policy */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Total Price
          </div>
          <div className="text-xl font-bold text-brand-600">€{total}</div>
          <div className="text-sm text-brand-secondary-hover">
            {bookingDetails.cancellationPolicy}
          </div>
        </div>

        {/* Dates & Time */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Dates & Time</div>
          <div className="text-gray-600">
            <DateRangePicker
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerIconClick={onDatePickerIconClick}
              onDateChangeHandler={onDateChangeHandler}
              setisDatePickerVisible={setisDatePickerVisible}
              dateRange={dateRange}
              inputStyle="DARK"
            />
          </div>
        </div>

        {/* Reservation Details */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Reservation</div>
          <Select
            value={selectedRooms}
            onChange={handleRoomsNumberChange}
            options={roomNumberOptions}
            className="mb-2"
          />
          <Select
            value={selectedGuests}
            onChange={handleGuestsNumberChange}
            options={guestOptions}
          />
        </div>

        {/* Room Type Selection */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Room Type</div>
          <Select
            value={selectedRoom}
            onChange={handleRoomTypeChange}
            options={roomOptions}
            placeholder="Select a room type"
          />
        </div>

        {/* Per Day Rate based on selected room */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Per day rate</div>
          <div className="text-gray-600">
            €{selectedRoom ? formatPrice(selectedRoom.price) : '0'}
          </div>
        </div>

        {/* Taxes */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Taxes</div>
          <div className="text-gray-600">€{taxes}</div>
          <div className="text-xs text-gray-500">{DEFAULT_TAX_DETAILS}</div>
        </div>

        {errorMessage && (
          <Toast type="error" message={errorMessage} dismissError={dismissError} />
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onBookingConfirm}
          className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-brand-secondary-hover transition duration-300"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;
