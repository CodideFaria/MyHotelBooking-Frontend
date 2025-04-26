import Review from './components/Review';
import React, { useState } from 'react';
import RatingsOverview from './components/RatingsOverview';
import UserRatingsSelector from './components/UserRatingsSelector';
import { networkAdapter } from 'services/NetworkAdapter';
import Toast from 'components/ux/toast/Toast';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import Loader from 'components/ux/loader/loader';

/**
 * Renders the user reviews component.
 *
 * @component
 * @param {Object} reviewData - The review data object.
 * @returns {JSX.Element} The user reviews component.
 */
const UserReviews = ({
  hotelId,
  reviewData,
  setReviewData,
  handlePageChange,
  handlePreviousPageChange,
  handleNextPageChange,
}) => {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [shouldHideUserRatingsSelector, setShouldHideUserRatingsSelector] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRating = (rate) => setUserRating(rate);
  const clearToastMessage = () => setToastMessage('');

  const handleReviewSubmit = async () => {
    if (userRating === 0) {
      setToastMessage({ type: 'error', message: 'Please select a rating' });
      return;
    }

    const response = await networkAdapter.post('/api/hotel/add-review', {
      rating: userRating,
      review: userReview,
      hotel_id: hotelId,
    });

    if (response.status === 'success') {
      const newReview = response.data;
      setReviewData(prev => {
        const { reviews = [], totalReviews = 0, averageRating = 0, starCounts = {} } = prev.data || {};
        const updatedReviews = [newReview, ...reviews];
        const updatedTotal = totalReviews + 1;
        const updatedStarCounts = { ...starCounts, [newReview.rating]: (starCounts[newReview.rating] || 0) + 1 };
        const updatedAverage = (averageRating * totalReviews + newReview.rating) / updatedTotal;

        return {
          ...prev,
          data: {
            ...prev.data,
            reviews: updatedReviews,
            totalReviews: updatedTotal,
            starCounts: updatedStarCounts,
            averageRating: updatedAverage,
          },
        };
      });

      setToastMessage({ type: 'success', message: 'Review submitted!' });
      setShouldHideUserRatingsSelector(true);
    } else {
      setToastMessage({ type: 'error', message: 'Submission failed.' });
    }
  };

  const handleUserReviewChange = (review) => setUserReview(review);

  // Guard against undefined data and ensure reviews is always an array
  const safeData = reviewData.data || {};
  const reviews = Array.isArray(safeData.reviews) ? safeData.reviews : [];
  const totalReviews = safeData.totalReviews || 0;
  const averageRating = safeData.averageRating || 0;
  const starCounts = safeData.starCounts || {};
  const isEmpty = reviews.length === 0;

  // Guard against undefined pagination
  const safePagination = reviewData.pagination || {};
  const currentPage = safePagination.currentPage || 1;
  const totalPages = safePagination.totalPages || 1;

  return (
    <div className="flex flex-col p-4 border-t">
      <h1 className="text-xl font-bold text-gray-700">User Reviews</h1>

      <div className="flex flex-col md:flex-row py-4 bg-white shadow-sm gap-6">
        {isEmpty ? (
          <div className="w-3/5">
            <span className="text-gray-500 italic">Be the first to leave a review!</span>
          </div>
        ) : (
          <RatingsOverview
            averageRating={averageRating}
            ratingsCount={totalReviews}
            starCounts={starCounts}
          />
        )}

        {!shouldHideUserRatingsSelector && (
          <UserRatingsSelector
            userRating={userRating}
            isEmpty={isEmpty}
            handleRating={handleRating}
            userReview={userReview}
            handleReviewSubmit={handleReviewSubmit}
            handleUserReviewChange={handleUserReviewChange}
          />
        )}
      </div>

      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          dismissError={clearToastMessage}
        />
      )}

      <div>
        {reviewData.isLoading ? (
          <Loader height="600px" />
        ) : (
          reviews.map((review, i) => (
            <Review
              key={i}
              reviewerName={`${review.user.first_name} ${review.user.last_name}`}
              reviewDate={review.created_at}
              review={review.comment}
              rating={review.rating}
            />
          ))
        )}
      </div>

      {!isEmpty && (
        <PaginationController
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        />
      )}
    </div>
  );
};

export default UserReviews;
