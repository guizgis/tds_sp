import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbCheck {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://192.170.12.201:5432/tds?connectTimeout=10&socketTimeout=10";
        String user = "tds_admin";
        String password = "NuAQPtc2WuM#6Cbc";

        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("PostgreSQL Driver not found!");
            e.printStackTrace();
            System.exit(1);
        }

        System.out.println("Testing connection to: " + url);
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Successfully connected to PostgreSQL!");
        } catch (SQLException e) {
            System.err.println("Connection failed!");
            e.printStackTrace();
            System.exit(1);
        }
    }
}