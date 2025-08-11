import { Card } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  markNotificationAsRead,
  // markNotificationAsReadByAdmin // 🔹 Backend ready hone par uncomment
} from "../../../Redux/Notifications/action";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const NotificationCard = ({ item, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReadNotification = () => {
    // USER case
    if (type === "USER" && !item.isRead && !isProcessing) {
      setIsProcessing(true);
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
      navigate("/bookings");
    }

    // ADMIN case (UI only for now)
    else if (type === "ADMIN" && !item.isRead && !isProcessing) {
      setIsProcessing(true);
      console.log("Mark admin notification as read:", item.id);
      // dispatch(markNotificationAsReadByAdmin({ notificationId: item.id, jwt: localStorage.getItem("jwt") }));
      setTimeout(() => {
        setIsProcessing(false);
        navigate("/admin-dashboard");
      }, 300); // simulate delay
    } else if (type === "ADMIN" && item.isRead) {
      navigate("/admin-dashboard");
    }
  };

  const formattedTime = item.createdAt
    ? format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")
    : "";

  return (
    <Card
      onClick={handleReadNotification}
      sx={{
        backgroundColor:
          item.isRead && (type === "USER" || type === "ADMIN")
            ? "#fff"
            : "#f0f7ff",
        borderLeft: "4px solid",
        borderColor:
          item.isRead && (type === "USER" || type === "ADMIN")
            ? "#ccc"
            : "#1976d2",
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
        <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
          {formattedTime}
        </p>
      </div>
    </Card>
  );
};

export default NotificationCard;
