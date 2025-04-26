import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';
import { networkAdapter } from 'services/NetworkAdapter';
import React, { useEffect, useState, useMemo } from 'react';
import ReactImageGallery from 'react-image-gallery';

const HotelDetailsViewCard = ({ hotelDetails }) => {
  const images = hotelDetails.images.map((image) => ({
    original: `/images/hotels/${hotelDetails.id}/${image}`,
    thumbnail: `/images/hotels/${hotelDetails.id}/${image}`,
    thumbnailClass: 'h-[80px]',
    thumbnailLoading: 'lazy',
  }));

  const today = useMemo(() => new Date(), []);

  const activePromotions = useMemo(() => {
    return (hotelDetails.promotions || [])
      .filter(p => p.is_active)
      .filter(p => {
        const start = new Date(p.start_date);
        const end   = new Date(p.end_date);
        return start <= today && today <= end;
      });
  }, [hotelDetails.promotions, today]);

  const bestDiscount = activePromotions.reduce(
    (max, p) => Math.max(max, p.discount_percentage),
    0
  );

  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
  });

  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentReviewPage(page);
  };

  const handlePreviousPageChange = () => {
    setCurrentReviewPage((prev) => {
      if (prev <= 1) return prev;
      return prev - 1;
    });
  };

  const handleNextPageChange = () => {
    setCurrentReviewPage((prev) => {
      if (prev >= reviewData.pagination.totalPages) return prev;
      return prev + 1;
    });
  };

  useEffect(() => {
    setReviewData({
      isLoading: true,
      data: [],
    });
    const fetchHotelReviews = async () => {
      const response = await networkAdapter.get(`/api/hotel/${hotelDetails.id}/reviews`, {
        currentPage: currentReviewsPage,
      });
      if (response.status === 'success') {
        setReviewData({
          isLoading: false,
          data: response.data
        });
      }
    };
    fetchHotelReviews();
  }, [hotelDetails.id, currentReviewsPage]);

  return (
    <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
      <div className="w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
        <div>
          <div className="relative w-full">
            <ReactImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
            />
            {activePromotions.length > 0 && (
              <div className="absolute top-0 right-0 m-4 flex flex-col space-y-2">
                {activePromotions.map(promo => (
                  <span
                    key={promo.id}
                    className="bg-red-600 text-white font-semibold text-xs px-2 py-1 rounded"
                  >
                    {promo.title}: {promo.discount_percentage}% OFF
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              {hotelDetails.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {hotelDetails.address}, {hotelDetails.city}, {hotelDetails.country}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              ✉️ {hotelDetails.email}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              📞 {hotelDetails.phone}
            </p>
            <div className="mt-2 space-y-2">
              <p className="text-gray-700">
                {hotelDetails.description}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">
                  {hotelDetails.features.join(' | ')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <UserReviews
          hotelId={hotelDetails.id}
          reviewData={reviewData}
          setReviewData={setReviewData}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        />
      </div>
      <HotelBookingDetailsCard
        hotelCode={hotelDetails.id}
        discountPercentage={bestDiscount}
      />
    </div>
  );
};

export default HotelDetailsViewCard;
