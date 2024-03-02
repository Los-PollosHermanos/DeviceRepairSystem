package com.Servlet;

import DBConnect.DBConnection;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

public class orderServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");

        if ("loadOrder".equals(requestType)) {
            int userId = Integer.parseInt(request.getParameter("userId")); // 获取 URL 中的 userId 参数
            loadOrders(userId, response);
        }
        else if ("searchOrder".equals(requestType)) {
            String remarks = request.getParameter("remarks");
            searchOrders(remarks, response);
        }
        else if ("loadTodoOrder".equals(requestType)) {
            int userId = Integer.parseInt(request.getParameter("userId")); // 获取 URL 中的 userId 参数
            loadTodoOrders(userId, response);
        }
        else if ("searchTodoOrder".equals(requestType)) {
            String remarks = request.getParameter("remarks");
            searchTodoOrders(remarks, response);
        }
        else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");

        if ("deleteOrder".equals(requestType)) {
            String orderId = request.getParameter("orderId");
            deleteOrder(orderId, response);
        }
        else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }

    private void loadOrders(int userId, HttpServletResponse response) throws IOException {
        JSONArray orders = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM ser_orders_services WHERE user_id = ?")) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject order = new JSONObject();
                order.put("order_id", rs.getInt("order_id"));
                order.put("repairman_id", rs.getInt("repairman_id"));
                order.put("remarks", rs.getString("remarks"));
                order.put("address", rs.getString("address"));
                order.put("status", rs.getString("status"));
                order.put("actual_price", rs.getInt("actual_price"));
                orders.put(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error loading orders");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        sendJsonResponse(orders, response);
    }

    private void searchOrders(String remarks, HttpServletResponse response) throws IOException {
        JSONArray orders = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM ser_orders_services WHERE user_id = 1 AND remarks LIKE ?")) {
//            stmt.setInt(1, 1);
            stmt.setString(1, "%" + remarks + "%");
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject order = new JSONObject();
                order.put("order_id", rs.getInt("order_id"));
                order.put("repairman_id", rs.getInt("repairman_id"));
                order.put("remarks", rs.getString("remarks"));
                order.put("address", rs.getString("address"));
                order.put("status", rs.getString("status"));
                order.put("actual_price", rs.getInt("actual_price"));
                orders.put(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error searching orders");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        sendJsonResponse(orders, response);
        System.out.println("查询订单成功");
    }

    private void loadTodoOrders(int userId, HttpServletResponse response) throws IOException {
        JSONArray orders = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT * FROM ser_orders_services WHERE user_id = ? AND status = '未分配维修人员'")) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject order = new JSONObject();
                order.put("order_id", rs.getInt("order_id"));
                order.put("repairman_id", rs.getInt("repairman_id"));
                order.put("remarks", rs.getString("remarks"));
                order.put("address", rs.getString("address"));
                order.put("status", rs.getString("status"));
                order.put("actual_price", rs.getInt("actual_price"));
                orders.put(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error loading todo orders");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        sendJsonResponse(orders, response);
    }

    private void searchTodoOrders(String remarks, HttpServletResponse response) throws IOException {
        JSONArray orders = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM ser_orders_services WHERE user_id = 1 AND status = '未分配维修人员' AND remarks LIKE ?")) {
//            stmt.setInt(1, 1);
            stmt.setString(1, "%" + remarks + "%");
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject order = new JSONObject();
                order.put("order_id", rs.getInt("order_id"));
                order.put("repairman_id", rs.getInt("repairman_id"));
                order.put("remarks", rs.getString("remarks"));
                order.put("address", rs.getString("address"));
                order.put("status", rs.getString("status"));
                order.put("actual_price", rs.getInt("actual_price"));
                orders.put(order);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error searching orders");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        sendJsonResponse(orders, response);
        System.out.println("查询订单成功");
    }

    private void deleteOrder(String orderId, HttpServletResponse response) throws IOException {
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM ser_orders_services WHERE order_id = ?")) {
            stmt.setInt(1, Integer.parseInt(orderId));
            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                response.getWriter().write("{\"status\":\"success\"}");
            } else {
                response.getWriter().write("{\"status\":\"failure\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error deleting order");
        }
    }

    private void sendJsonResponse(JSONArray jsonArray, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonArray.toString());
    }

    private void sendJsonResponse(JSONObject jsonObject, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonObject.toString());
    }
}
