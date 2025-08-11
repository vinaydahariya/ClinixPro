package com.clinixPro.exception;

public class ClinicNotFoundException extends RuntimeException {

    public ClinicNotFoundException(String message) {
        super(message);
    }

    public ClinicNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
