package DBConnect;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Vector;

public class DBConnection {

    private static final int INITIAL_POOL_SIZE = 5;
    private static final Vector<Connection> connectionPool = new Vector<>();

    static {
        try {
            // 预先加载驱动
            Class.forName("com.mysql.jdbc.Driver");

            // 初始化连接池
            for (int i = 0; i < INITIAL_POOL_SIZE; i++) {
                connectionPool.addElement(createNewConnectionForPool());
            }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            throw new ExceptionInInitializerError(e);
        }
    }

    private static Connection createNewConnectionForPool() throws SQLException {
        String url = "jdbc:mysql://8.137.35.105:3306/vue?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8";
        String user = "root";
        String password = "!Hxz20020224";
        return DriverManager.getConnection(url, user, password);
    }

    public static synchronized Connection getConnection() {
        if (connectionPool.isEmpty()) {
            // 如果连接池空了，再创建一些连接
            try {
                for (int i = 0; i < INITIAL_POOL_SIZE; i++) {
                    connectionPool.addElement(createNewConnectionForPool());
                }
            } catch (SQLException e) {
                throw new RuntimeException("Error creating new connection", e);
            }
        }
        Connection connection = connectionPool.remove(connectionPool.size() - 1);
        return connection;
    }

    public static synchronized void returnConnection(Connection connection) {
        connectionPool.addElement(connection);
    }
}
