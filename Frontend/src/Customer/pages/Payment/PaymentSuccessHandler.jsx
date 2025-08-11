import { Backdrop, Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentScuccess } from "../../../Redux/Payment/action";


const PaymentSuccessHandler = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { booking } = useSelector(store => store)
    const navigate=useNavigate();

    const getQueryParam = (key)=> {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };
    const paymentId = getQueryParam("razorpay_payment_id");
    const paymentLinkId = getQueryParam("razorpay_payment_link_id");
    // const paymentId="cs_test_a1eU8pFuXZJlg3tiahN153QykvQl6LI5hLgSnUUh01alidIPrMU8KyDx67"

    useEffect(() => {
        if (paymentId) {
            dispatch(
                paymentScuccess({
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                    jwt: localStorage.getItem("jwt") || "",
                })
            );
        }
    }, [paymentId]);


    return (
        <div className="min-h-[90vh] flex justify-center items-center">
            {true ? <div className="bg-primary-color text-white p-8 w-[90%] lg:w-[25%] border rounded-md h-[40vh] flex flex-col gap-7 items-center justify-center">
                <h1 className="text-3xl font-semibold">Congratulations!</h1>
                <h1 className="text-2xl font-semibold">Your Booking Get Success!</h1>
                <div>
                    <Button onClick={()=>navigate("/")} color="secondary" variant="contained">Go To Home</Button>
                </div>

            </div> : <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            
            >
                <CircularProgress color="inherit" />
            </Backdrop>}
           
        </div>
    );
};

export default PaymentSuccessHandler;
