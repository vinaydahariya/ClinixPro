import React, { useState } from "react";
import { Avatar, IconButton, Rating, Box, Typography, Grid, Menu, MenuItem, Modal, Snackbar, Alert } from "@mui/material";
import { red } from "@mui/material/colors";
import { deleteReview } from "../../../../Redux/Review/action";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpdateReviewForm from "./UpdateReviewForm";

const ReviewCard = ({ item }) => {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteReview = async () => {
    try {
      await dispatch(deleteReview({ reviewId: item.id, jwt: localStorage.getItem("jwt") || "" }));
      setOpenSnackbar(true);
    } catch (error) {
      console.log("Error deleting review:", error);
    }
    handleMenuClose();
  };

  const handleUpdateReview = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  return (
    <>
      <Box className="p-4 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition">
        <Grid container spacing={2} alignItems="flex-start">
          {/* ✅ Avatar */}
          <Grid item>
            <Avatar
              sx={{ width: 50, height: 50, bgcolor: "#9155FD" }}
              src={item.userImage || ""}
              alt={item.userName || "User"}
            >
              {!item.userImage && (item.userName?.[0] || "U")}
            </Avatar>
          </Grid>

          {/* ✅ Review Content */}
          <Grid item xs>
            <Box className="flex flex-col">
              <Box className="flex justify-between items-center">
                <Typography variant="subtitle1" className="font-semibold">
                  {item.userName || "Unknown User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Rating readOnly value={item.rating} precision={0.5} size="small" sx={{ mt: 0.5 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {item.reviewText}
              </Typography>
            </Box>
          </Grid>

          {/* ✅ Menu - Only for user's review */}
          {item.userId === auth.user?.id && (
            <Grid item>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleUpdateReview}>Update Review</MenuItem>
                <MenuItem onClick={handleDeleteReview} sx={{ color: red[700] }}>
                  Delete Review
                </MenuItem>
              </Menu>
            </Grid>
          )}
        </Grid>

        {/* ✅ Update Review Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              p: 4,
              boxShadow: 24,
              borderRadius: 2,
              width: { xs: '90%', sm: '400px' },
            }}
          >
            <UpdateReviewForm reviewData={item} onClose={() => setOpenModal(false)} />
          </Box>
        </Modal>
      </Box>

      {/* ✅ Snackbar for Delete */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Review deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewCard;
