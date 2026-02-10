package com.smartshopV1.exception;

/**
 * Thrown when user has wrong role.
 * Returns 403 error.
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
