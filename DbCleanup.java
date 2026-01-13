import java.sql.*;

public class DbCleanup {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://192.170.12.201:5432/tds?sslmode=disable";
        String user = "tds_admin";
        String password = "NuAQPtc2WuM#6Cbc";
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("TRUNCATING catalogs table...");
            conn.createStatement().execute("TRUNCATE TABLE catalogs CASCADE");
            System.out.println("Table truncated.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}