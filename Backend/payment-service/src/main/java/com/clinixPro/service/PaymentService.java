package com.clinixPro.service;

import com.clinixPro.domain.PaymentMethod;
import com.clinixPro.entity.PaymentOrder;
import com.clinixPro.payload.dto.BookingDto;
import com.clinixPro.payload.dto.UserDto;
import com.clinixPro.payload.response.PaymentLinkResponse;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {

    PaymentLinkResponse createOrder(UserDto userDto,
                                    BookingDto bookingDto,
                                    PaymentMethod paymentMethod) throws RazorpayException, StripeException;

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentId);

    PaymentLink createRazorpayPaymentLink(UserDto userDto,
                                          Long Amount,
                                          Long orderId) throws RazorpayException;

    String createStripePaymentLink(UserDto userDto,
                                   Long Amount,
                                   Long orderId) throws StripeException;

    Boolean proceedPayment(PaymentOrder paymentOrder, String paymentId,
                           String paymentLinkId) throws RazorpayException;
}
