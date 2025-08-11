import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Badge, Drawer, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NotificationsActive } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = ({ DrawerList }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Get auth data from Redux store
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase();

  return (
    <div className="h-[10vh] flex items-center justify-between px-5 border-b">
      {/* Left side menu & Logo */}
      <div className="flex items-center gap-5">
        <IconButton onClick={toggleDrawer(true)} color="primary">
          <MenuIcon color="primary" />
        </IconButton>

        <h1 
          className="logo text-xl font-semibold text-primary-color cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          ClinixPro
        </h1>

        <h1 className="text-lg text-black hover:text-gray-700 transition-colors">
          Admin Dashboard
        </h1>
      </div>

      {/* Right side - Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <Link to="/admin/notifications">
          <IconButton>
            <Badge badgeContent={unreadCount || 0} color="secondary">
              <NotificationsActive color="primary" />
            </Badge>
          </IconButton>
        </Link>

        {/* Admin Full Name */}
        {user?.fullName && (
          <span className="font-medium text-black hidden sm:block">
            {user.fullName.split(' ')[0]} {user.fullName.split(' ')[1]}
          </span>
        )}

        {/* Avatar */}
        <IconButton onClick={() => navigate('/admin/account')}>
          {user?.image ? (
            <Avatar src={user.image} alt="Admin" />
          ) : (
            <Avatar>
              {getInitial(user?.fullName)}
            </Avatar>
          )}
        </IconButton>
      </div>

      {/* Drawer Menu */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  );
};

export default Navbar;