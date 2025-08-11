import React, { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerBookings } from "../../../Redux/Booking/action";
import { jwtDecode } from "jwt-decode";

const Bookings = () => {
  const dispatch = useDispatch();
  const { booking } = useSelector((store) => store);
  const [localBookings, setLocalBookings] = useState([]);

  const jwt = localStorage.getItem("jwt");
  const userId = jwt ? jwtDecode(jwt)?.userId || jwtDecode(jwt)?.sub : null;
  const storageKey = `removedBookings_${userId}`;

  // ✅ Define status priority
  const statusPriority = {
    CONFIRMED: 1,
    PENDING: 2,
    SUCCESS: 3,
    CANCELLED: 4,
  };

  useEffect(() => {
    if (jwt) dispatch(fetchCustomerBookings(jwt));
  }, [jwt, dispatch]);

  useEffect(() => {
    const removedIds = JSON.parse(localStorage.getItem(storageKey)) || [];

    const filteredBookings = [...booking.bookings]
      .filter((b) => !removedIds.includes(b.id))
      .sort((a, b) => {
        // ✅ 1st priority: Status order
        const priorityA = statusPriority[a.bookingStatus] || 99;
        const priorityB = statusPriority[b.bookingStatus] || 99;

        if (priorityA !== priorityB) {
          return priorityA - priorityB; // Lower number = higher priority
        }

        // ✅ 2nd priority: Latest createdAt
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;
        return dateB - dateA;
      });

    setLocalBookings(filteredBookings);
  }, [booking.bookings]);

  const handleRemoveFromList = (id) => {
    setLocalBookings((prev) => prev.filter((b) => b.id !== id));

    let removedIds = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (!removedIds.includes(id)) {
      removedIds.push(id);
      localStorage.setItem(storageKey, JSON.stringify(removedIds));
    }
  };

  return (
    <div className="px-5 md:flex flex-col items-center mt-10 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold py-5">My Bookings</h1>
      </div>
      <div className="space-y-4 md:w-[35rem]">
        {localBookings.length > 0 ? (
          localBookings.map((item) => (
            <BookingCard
              key={item.id}
              booking={item}
              onRemove={handleRemoveFromList}
            />
          ))
        ) : (
          <p className="text-gray-500">No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
