package com.smartshopV1.aop;

import com.smartshopV1.entity.User;
import com.smartshopV1.enums.Role;
import com.smartshopV1.exception.ForbiddenException;
import com.smartshopV1.exception.UnauthorizedException;
import com.smartshopV1.security.annotation.RequireAdmin;
import com.smartshopV1.security.annotation.RequireClient;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Simple AOP for checking user roles.
 */
@Aspect
@Component
public class AuthorizationAspect {

    /**
     * Check if user is ADMIN
     */
    @Before("@annotation(requireAdmin)")
    public void checkAdmin(RequireAdmin requireAdmin) {
        User user = getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Please login first");
        }

        if (user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only admins can access this");
        }
    }

    /**
     * Check if user is CLIENT
     */
    @Before("@annotation(requireClient)")
    public void checkClient(RequireClient requireClient) {
        User user = getCurrentUser();

        if (user == null) {
            throw new UnauthorizedException("Please login first");
        }

        if (user.getRole() != Role.CLIENT) {
            throw new ForbiddenException("Only clients can access this");
        }
    }

    /**
     * Get current user from session
     */
    private User getCurrentUser() {
        ServletRequestAttributes attributes =
            (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        HttpSession session = request.getSession();
        return (User) session.getAttribute("user");
    }
}
