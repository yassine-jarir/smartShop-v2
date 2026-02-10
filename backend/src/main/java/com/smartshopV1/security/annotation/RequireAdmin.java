package com.smartshopV1.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to restrict endpoint access to ADMIN role only.
 * Apply to controller methods that require admin privileges.
 *
 * Usage:
 * @RequireAdmin
 * @PostMapping("/admin/users")
 * public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO dto) { ... }
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireAdmin {
}

