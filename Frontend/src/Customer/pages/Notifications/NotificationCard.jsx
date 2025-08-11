import { Card } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { markNotificationAsRead } from "../../../Redux/Notifications/action";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const NotificationCard = ({ item, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Prevent multiple clicks

  const handleReadNotification = () => {
    if (type === "USER" && !item.isRead && !isProcessing) {
      setIsProcessing(true); // ✅ Prevent duplicate clicks
      dispatch(
        markNotificationAsRead({
          notificationId: item.id,
          jwt: localStorage.getItem("jwt"),
        })
      ).finally(() => {
        setIsProcessing(false);
        navigate("/bookings");
      });
    } else if (type === "USER" && item.isRead) {
      // ✅ If already read, just navigate (no decrement)
      navigate("/bookings");
    }
  };

  // ✅ Format time from backend
  const formattedTime = item.createdAt
    ? format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")
    : "";

  return (
    <Card
      onClick={handleReadNotification}
      sx={{
        backgroundColor: item.isRead && type === "USER" ? "#fff" : "#f0f7ff",
        borderLeft: "4px solid",
        borderColor: item.isRead && type === "USER" ? "#ccc" : "#1976d2",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": {
          backgroundColor: "#e8f0fe",
        },
      }}
      className="shadow-sm rounded-lg"
    >
      <div
        style={{
          backgroundColor: "#1976d2",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "40px",
          minHeight: "40px",
        }}
      >
        <NotificationsActiveIcon style={{ color: "#fff" }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: "500", fontSize: "15px" }}>
          {item.description}
        </p>
        {item.booking?.services?.length > 0 && (
          <h1 className="space-x-2 text-gray-500 text-sm">
            {item.booking.services.map((service) => (
              <span key={service.id}>{service.name}</span>
            ))}
          </h1>
        )}
        {/* ✅ Show real timestamp */}
        <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
          {formattedTime}
        </p>
      </div>
    </Card>
  );
};

export default NotificationCard;
