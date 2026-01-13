import java.sql.*;

public class DbInspect {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://192.170.12.201:5432/tds?sslmode=disable";
        String user = "tds_admin";
        String password = "NuAQPtc2WuM#6Cbc";
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            ResultSet rs = conn.createStatement().executeQuery("SELECT id, name, status, provider_id FROM catalogs");
            int count = 0;
            while (rs.next()) {
                count++;
                System.out.println("ID: " + rs.getString("id") + ", Name: " + rs.getString("name") + ", Status: " + rs.getString("status"));
            }
            System.out.println("Total records: " + count);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
