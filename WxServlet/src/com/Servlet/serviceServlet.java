package com.Servlet;

import DBConnect.DBConnection;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

public class serviceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");

        if ("loadTypes".equals(requestType)) {
            handleLoadTypesRequest(response);
        }
        else if ("detail".equals(requestType)) {
            String typeId = request.getParameter("typeId");
            handleDetailRequest(typeId, response);
        }
        else {
            // 处理其他GET请求或返回错误
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8"); // 设置请求字符集为 UTF-8
        String requestType = request.getParameter("requestType");

        if ("createOrder".equals(requestType)) {
            handleCreateOrderRequest(request, response);
        }
        else {
            // 处理其他POST请求或返回错误
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }


    private void handleLoadTypesRequest(HttpServletResponse response) throws IOException {
        JSONArray types = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            String sql = "SELECT * FROM ser_types";
            ResultSet rs = stmt.executeQuery(sql);

            while (rs.next()) {
                JSONObject type = new JSONObject();
                type.put("type_id", rs.getInt("type_id"));
                type.put("type_name", rs.getString("type_name"));
                types.put(type);
            }
        } catch (SQLException | JSONException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing request");
        }

        sendJsonResponse(types, response);
    }

    private void handleDetailRequest(String typeId, HttpServletResponse response) throws IOException {
        JSONArray categories = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM ser_categories WHERE type_id = ?")) {
            stmt.setInt(1, Integer.parseInt(typeId));
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject category = new JSONObject();
                category.put("category_id", rs.getInt("category_id"));
                category.put("type_id", rs.getInt("type_id"));
                category.put("category_name", rs.getString("category_name"));
                // 可以根据需要添加更多的字段
                categories.put(category);
            }
        } catch (SQLException | JSONException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing request");
        }

        sendJsonResponse(categories, response);
    }

    private void sendJsonResponse(JSONArray jsonArray, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonArray.toString());
    }

    private void handleCreateOrderRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 解析请求数据
        String userId = request.getParameter("userId");
        String remarks = request.getParameter("remarks");
        String address = request.getParameter("address");
        String categoryId = request.getParameter("categoryId");
        String initialPrice = request.getParameter("initialPrice");
        String orderTime = request.getParameter("orderTime");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO ser_orders_services (user_id, remarks, order_time, address, category_id, initial_price, status) VALUES (?, ?, ?, ?, ?, ?, '未分配维修人员')")) {

            stmt.setInt(1, Integer.parseInt(userId));
            stmt.setString(2, remarks);
            stmt.setString(3, orderTime);
            stmt.setString(4, address);
            stmt.setInt(5, Integer.parseInt(categoryId));
            stmt.setDouble(6, Double.parseDouble(initialPrice));

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"status\":\"success\"}");
            } else {
                throw new SQLException("Creating order failed, no rows affected.");
            }
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error creating order: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.err.println("Number Format Error: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("General Error: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error creating order: " + e.getMessage());
        }
    }


    // 这里可以添加其他方法来处理不同的requestType
    // 例如，handleDetailRequest, handleSearchRequest, 等等

    // ... 其他方法 ...
}
