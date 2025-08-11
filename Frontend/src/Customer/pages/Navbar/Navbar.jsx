import {
  Avatar,
  Badge,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import React, { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Redux/Auth/action";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import useNotificationWebsoket from "../../../util/useNotificationWebsoket";
import { fetchNotificationsByUser } from "../../../Redux/Notifications/action";
import { useTheme } from "@emotion/react";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, notification } = useSelector((store) => store);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => () => {
    if (path == "/logout") {
      dispatch(logout());
      navigate("/");
      handleClose();
      return;
    }
    navigate(path);
    handleClose();
  };
  useEffect(() => {
    if (auth.user?.id) {
      dispatch(fetchNotificationsByUser({
        userId:auth.user.id,
        jwt:localStorage.getItem('jwt')
      }));
    }
  }, [auth.user]);

  useNotificationWebsoket(auth.user?.id,"user")
  return (
    <div className={`z-50  px-6  flex items-center justify-between  py-2 fixed top-0 left-0 right-0 bg-white`}>
      <div className="flex items-center gap-10">
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer font-bold lg:text-2xl "
        >
          Clinic Service
        </h1>
        <div className="lg:flex items-center gap-5 hidden">
          <h1 className="cursor-pointer hover:text-primary-color" onClick={()=>navigate("/")}>Home</h1>
          
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        {/* <Button onClick={() => navigate("/become-partner")} variant="outlined">
          Become Partner
        </Button> */}
        {auth.user?.role !== "CLINIC_OWNER" && (
          <Button onClick={() => navigate("/become-partner")} variant="outlined">
            Become Partner
          </Button>
        )}

        <IconButton onClick={() => navigate("/notifications")}>
          <Badge badgeContent={notification.unreadCount} color="secondary">
            {/* <MailIcon color="action" /> */}
            <NotificationsActiveIcon color="primary" />
          </Badge>
        </IconButton>

        {auth.user?.id ? (
          <div className="flex gap-1 items-center">
            <h1 className="text-lg font-semibold hidden lg:block">{auth.user?.fullName}</h1>

            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar
                sx={{ bgcolor: theme.palette.primary.main }}
                src={auth.user?.image || ""}
              >
                {!auth.user?.image && auth.user?.fullName?.[0]?.toUpperCase()}
              </Avatar>

            </IconButton>
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleMenuClick("/bookings")}>My Bookings</MenuItem>
            {auth.user?.role === "CLINIC_OWNER" && (
              <MenuItem onClick={handleMenuClick("/clinic-dashboard")}>
                Dashboard
              </MenuItem>
            )}
            <MenuItem onClick={handleMenuClick("/update-profile")}>Update Profile</MenuItem>
            <MenuItem onClick={handleMenuClick("/logout")}>Logout</MenuItem>
          </Menu>

          </div>
        ) : (
          <IconButton  onClick={() => navigate("/login")}>
            <AccountCircleIcon sx={{ fontSize: "45px", color: theme.palette.primary.main }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;
