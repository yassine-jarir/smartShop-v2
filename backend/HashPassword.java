import org.mindrot.jbcrypt.BCrypt;

public class HashPassword {
    public static void main(String[] args) {
        String password = "admin@admin.com";
        String hashed = BCrypt.hashpw(password, BCrypt.gensalt(12));
        System.out.println("Hashed password: " + hashed);
    }
}
