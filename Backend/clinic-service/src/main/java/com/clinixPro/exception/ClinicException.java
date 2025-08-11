package com.clinixPro.exception;

public class ClinicException extends RuntimeException {

    public ClinicException(String message) {
        super(message);
    }

    public ClinicException(String message, Throwable cause) {
        super(message, cause);
    }
}
