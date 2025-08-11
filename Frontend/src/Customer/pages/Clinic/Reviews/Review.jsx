import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../../../Redux/Review/action";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import { Divider } from "@mui/material";
import RatingCard from "./RatingCard";

const Review = () => {
  const dispatch = useDispatch();
  const { review } = useSelector((store) => store);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchReviews({ clinicId: id, jwt: localStorage.getItem("jwt") }));
    }
  }, [id, dispatch]);

  // ✅ Calculate Average Rating
  const totalReview = review.reviews.length;
  const averageRating =
    totalReview > 0
      ? (
          review.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          totalReview
        ).toFixed(1)
      : 0;

  // ✅ Ratings breakdown (5 to 1 star)
  const ratings = [5, 4, 3, 2, 1];
  const breakdown = ratings.map(
    (star) => review.reviews.filter((r) => Math.floor(r.rating) === star).length
  );

  return (
    <div className='pt-10 flex flex-col lg:flex-row gap-20'>
      <section className='w-full md:w-1/2 lg:w-[40%] space-y-2'>
        <h1 className="font-semibold text-lg pb-4">
          Review & Ratings
        </h1>
        <RatingCard
          totalReview={totalReview}
          averageRating={parseFloat(averageRating)}
          breakdown={breakdown}
        />
      </section>

      <section className="w-full md:w-1/2 lg:w-[60%]">
        <div className='mt-10'>
          <div className="space-y-5">
            {review.reviews.map((item, i) => (
              <div key={item.id || i} className='space-y-5'>
                <ReviewCard item={item} />
                {review.reviews.length - 1 !== i && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Review;
