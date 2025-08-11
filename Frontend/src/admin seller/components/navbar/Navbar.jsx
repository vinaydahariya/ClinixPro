import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Badge, Drawer, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NotificationsActive } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsByClinic } from "../../../Redux/Notifications/action";
import useNotificationWebsoket from "../../../util/useNotificationWebsoket";

const Navbar = ({ DrawerList }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { notification, clinic } = useSelector((store) => store);
  const dispatch = useDispatch();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (clinic.clinic?.id) {
      dispatch(
        fetchNotificationsByClinic({
          clinicId: clinic.clinic.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [clinic.clinic?.id]);

  useNotificationWebsoket(clinic.clinic?.id, "clinic");

  return (
    <div className="h-[10vh] flex items-center justify-between px-5 border-b">
      {/* Left side menu & Logo */}
      <div className="flex items-center gap-5">
        <IconButton onClick={toggleDrawer(true)} color="primary">
          <MenuIcon color="primary" />
        </IconButton>

        <h1
          onClick={() => navigate("/bookings")}
          className="logo text-xl cursor-pointer"
        >
          ClinixPro
        </h1>

        {/* ✅ Home Link - Black Color, No underline */}
        <h1
          onClick={() => navigate("/")}
          className="text-lg cursor-pointer text-black hover:text-gray-700 transition-colors"
        >
          Home
        </h1>
      </div>

      {/* Notifications */}
      <IconButton onClick={() => navigate("/clinic-dashboard/notifications")}>
        <Badge
          badgeContent={notification.notifications.length}
          color="secondary"
        >
          <NotificationsActive color="primary" />
        </Badge>
      </IconButton>

      {/* Drawer Menu */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  );
};

export default Navbar;
