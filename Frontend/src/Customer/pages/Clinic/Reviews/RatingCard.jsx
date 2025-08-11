import { Box, Grid2, LinearProgress, Rating } from '@mui/material';
import React from 'react';

const RatingCard = ({ totalReview, averageRating, breakdown }) => {
  return (
    <div className="border p-5 rounded-md">
      {/* ✅ Average Rating */}
      <div className="flex items-center space-x-3 pb-10">
        <Rating
          name="read-only"
          value={averageRating}
          precision={0.5}
          readOnly
        />
        <p className="opacity-60">{totalReview} Ratings</p>
      </div>

      {/* ✅ Ratings Breakdown */}
      {["Excellent", "Very Good", "Good", "Average", "Poor"].map((label, index) => {
        const value = breakdown[index] || 0;
        return (
          <Box key={label} sx={{ mb: 1 }}>
            <Grid2
              container
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <Grid2 size={2}>
                <p className="p-0">{label}</p>
              </Grid2>
              <Grid2 size={7}>
                <LinearProgress
                  sx={{ bgcolor: "#d0d0d0", borderRadius: 4, height: 7 }}
                  variant="determinate"
                  value={totalReview > 0 ? (value / totalReview) * 100 : 0}
                  color={index < 3 ? "success" : index === 3 ? "warning" : "error"}
                />
              </Grid2>
              <Grid2 size={2}>
                <p className="opacity-50 p-2">{value}</p>
              </Grid2>
            </Grid2>
          </Box>
        );
      })}
    </div>
  );
};

export default RatingCard;
