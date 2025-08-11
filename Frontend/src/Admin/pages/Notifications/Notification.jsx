import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  addNotification,
  clearAllNotificationsByUser,
  clearAllNotificationsByClinic,
  // clearAllNotificationsByAdmin // 🔹 Backend ready hone par uncomment karna
} from "../../../Redux/Notifications/action";
import NotificationCard from "./NotificationCard";
import { Button } from "@mui/material";

const Notification = ({ type }) => {
  const dispatch = useDispatch();
  const { auth, notification } = useSelector((store) => store);

  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:1016/api/notifications/ws");
    const stomp = Stomp.over(sock);
    setStompClient(stomp);
  }, []);

  useEffect(() => {
    if (stompClient && auth.user?.id) {
      stompClient.connect(
        {},
        () => {
          stompClient.subscribe(
            `/notification/user/${auth.user?.id}`,
            onMessageReceive,
            (error) => {
              console.error("Subscription error:", error);
            }
          );
        },
        (error) => {
          console.error("WebSocket error:", error);
        }
      );
    }
  }, [stompClient, auth.user?.id]);

  const onMessageReceive = (payload) => {
    const receivedNotification = JSON.parse(payload.body);
    dispatch(addNotification(receivedNotification));
  };

  const handleClearAll = () => {
    if (auth.user?.role === "CUSTOMER") {
      dispatch(
        clearAllNotificationsByUser({
          userId: auth.user?.id,
          jwt: auth.jwt,
        })
      );
    } else if (auth.user?.role === "CLINIC_OWNER") {
      dispatch(
        clearAllNotificationsByClinic({
          clinicId: auth.user?.clinicId,
          jwt: auth.jwt,
        })
      );
    } else if (auth.user?.role === "ADMIN") {
      // 🔹 Abhi ke liye sirf UI action
      console.log("Clear all admin notifications (UI only)");
      // dispatch(clearAllNotificationsByAdmin({ jwt: auth.jwt }));
    }
  };

  return (
    <div className="flex justify-center px-5 md:px-20 py-5 md:py-10">
      <div className="space-y-5 w-full lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notification.notifications.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearAll}
              sx={{
                textTransform: "none",
                borderColor: "#1976d2",
                color: "#1976d2",
                fontWeight: 500,
              }}
            >
              Clear All
            </Button>
          )}
        </div>

        {notification.notifications.length > 0 ? (
          notification.notifications.map((item) => (
            <NotificationCard type={type} key={item.id} item={item} />
          ))
        ) : (
          <p className="text-center text-gray-500">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
