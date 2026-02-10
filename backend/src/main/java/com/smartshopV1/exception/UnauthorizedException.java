package com.smartshopV1.exception;

/**
 * Thrown when user is not logged in.
 * Returns 401 error.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
