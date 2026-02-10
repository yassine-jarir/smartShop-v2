package com.smartshopV1.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to restrict endpoint access to CLIENT role only.
 * Apply to controller methods that require client privileges.
 *
 * Usage:
 * @RequireClient
 * @GetMapping("/client/orders")
 * public ResponseEntity<List<OrderResponseDTO>> getMyOrders() { ... }
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireClient {
}

