package com.Servlet;

import DBConnect.DBConnection;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

public class weatherServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");
        if ("loadWeather".equals(requestType)) {
//            int userId = Integer.parseInt(request.getParameter("userId")); // 获取 URL 中的 userId 参数
            loadWeather(response);
        }
        else if ("searchWeather".equals(requestType)) {
            String weather_type = request.getParameter("weather_type");
            searchWeather(weather_type, response);
        }
        else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");

        if ("deleteWeather".equals(requestType)) {
            String orderId = request.getParameter("orderId");
            deleteWeather(orderId, response);
        }
        else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
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

    private void loadWeather(HttpServletResponse response) throws IOException {
        JSONArray orders = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM weather")) {
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject order = new JSONObject();
                order.put("id", rs.getInt("id"));
                order.put("city", rs.getString("city"));
                order.put("temperature", rs.getString("temperature"));
                order.put("weather_type", rs.getString("weather_type"));
                order.put("wind", rs.getString("wind"));
                order.put("create_time", rs.getString("create_time"));
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

    private void searchWeather(String weather_type, HttpServletResponse response) throws IOException {
        JSONArray orders = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM weather WHERE weather_type LIKE ?")) {
            stmt.setString(1, "%" + weather_type + "%");
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject order = new JSONObject();
                order.put("id", rs.getInt("id"));
                order.put("city", rs.getString("city"));
                order.put("temperature", rs.getString("temperature"));
                order.put("weather_type", rs.getString("weather_type"));
                order.put("wind", rs.getString("wind"));
                order.put("create_time", rs.getString("create_time"));
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

    private void deleteWeather(String orderId, HttpServletResponse response) throws IOException {
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM weather WHERE id = ?")) {
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
}
