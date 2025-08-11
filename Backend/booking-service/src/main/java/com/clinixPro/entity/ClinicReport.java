package com.clinixPro.entity;

import lombok.Data;

@Data
public class ClinicReport {

    private Long clinicId;
    private int totalEarnings;
    private Integer totalBookings;
    private Integer cancelledBookings;
    private Double totalRefund;


}
