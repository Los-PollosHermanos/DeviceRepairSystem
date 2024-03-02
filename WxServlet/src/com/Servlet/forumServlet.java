package com.Servlet;

import DBConnect.DBConnection;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.*;

public class forumServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");

        if ("square".equals(requestType)) {
            handleSquareRequest(response);
        }
        else if ("detail".equals(requestType)) {
            String postId = request.getParameter("postId");
            handleDetailRequest(postId, response);
        }
        else if ("search".equals(requestType)) {
            String query = request.getParameter("query");
            handleSearchRequest(query, response);
        }
        else {
            // 无效的请求类型处理
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestType = request.getParameter("requestType");

        if ("post".equals(requestType)) {
            handlePostRequest(request, response);
        }
        else {
            // 处理其他POST请求或返回错误
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request type");
        }
    }

    private void handleSquareRequest(HttpServletResponse response) throws IOException {
        JSONArray posts = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            String sql = "SELECT * FROM forum_post_list";
            ResultSet rs = stmt.executeQuery(sql);

            while (rs.next()) {
                JSONObject post = new JSONObject();
                post.put("PostID", rs.getInt("PostID"));
                post.put("UserID", rs.getInt("UserID"));
                post.put("Title", rs.getString("Title"));
                post.put("Content", rs.getString("Content"));
                post.put("PostTime", rs.getString("PostTime"));
                post.put("UpdateTime", rs.getString("UpdateTime"));
                posts.put(post);
            }
        } catch (SQLException | JSONException e) {
            e.printStackTrace();
            // Handle the exception appropriately
        }

        sendJsonResponse(posts, response);
    }

    private void handleDetailRequest(String postId, HttpServletResponse response) throws IOException {
        JSONObject post = new JSONObject();
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            String sql = "SELECT * FROM forum_post_list WHERE PostID = " + postId;
            ResultSet rs = stmt.executeQuery(sql);

            if (rs.next()) {
                post.put("PostID", rs.getInt("PostID"));
                post.put("UserID", rs.getInt("UserID"));
                post.put("Title", rs.getString("Title"));
                post.put("Content", rs.getString("Content"));
                post.put("PostTime", rs.getString("PostTime"));
                post.put("UpdateTime", rs.getString("UpdateTime"));
            }
        } catch (SQLException | JSONException e) {
            e.printStackTrace();
            // Handle the exception appropriately
        }

        sendJsonResponse(post, response);
    }

    private void sendJsonResponse(JSONObject jsonObject, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonObject.toString());
    }

    private void sendJsonResponse(JSONArray jsonArray, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonArray.toString());
    }

    private void handleSearchRequest(String query, HttpServletResponse response) throws IOException {
        JSONArray posts = new JSONArray();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT * FROM forum_post_list WHERE Title LIKE ? ORDER BY PostTime DESC")) {
            stmt.setString(1, "%" + query + "%");
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject post = new JSONObject();
                post.put("PostID", rs.getInt("PostID"));
                post.put("UserID", rs.getInt("UserID"));
                post.put("Title", rs.getString("Title"));
                post.put("Content", rs.getString("Content"));
                post.put("PostTime", rs.getString("PostTime"));
                post.put("UpdateTime", rs.getString("UpdateTime"));
                posts.put(post);
            }
        } catch (SQLException | JSONException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing search request");
        }

        sendJsonResponse(posts, response);
    }


    private void handlePostRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Extracting title, content, and post time from the request
        String title = request.getParameter("Title");
        String content = request.getParameter("Content");
        String postTime = request.getParameter("PostTime");
        String userId = "103";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO forum_post_list (UserID, Title, Content, PostTime, UpdateTime) VALUES (?, ?, ?, ?, ?)")) {

            // Setting the parameters for the PreparedStatement
            stmt.setString(1, userId);
            stmt.setString(2, title);
            stmt.setString(3, content);
            stmt.setString(4, postTime);
            stmt.setString(5, postTime); // UpdateTime initially set to PostTime

            // Executing the update
            stmt.executeUpdate();

            // Setting the response type and character encoding
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"status\":\"success\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error processing the post");
        }
    }


}
