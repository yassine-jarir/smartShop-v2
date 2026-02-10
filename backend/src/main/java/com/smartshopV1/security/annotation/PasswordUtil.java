package com.smartshopV1.security.annotation;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {

    public static String hashPassword(String raw) {
        return BCrypt.hashpw(raw, BCrypt.gensalt(12));
    }

    public static boolean checkPassword(String raw, String hashed) {
        return BCrypt.checkpw(raw, hashed);
    }
}
