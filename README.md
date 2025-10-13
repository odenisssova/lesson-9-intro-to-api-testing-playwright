# Lesson 9 — API Testing with Playwright

This project contains API tests implemented with Playwright.
The task to cover basic API requests such as: GET, PUT, DELETE and to check the response status code.

## API Checklist

# API Testing Checklist

| Endpoint          | Method     | Expected Status Code | Notes                                    |
|-------------------|------------|----------------------|------------------------------------------|
| `/test-orders/{id}` | **GET**    | 200 OK               | Get an order by ID                       |
| `/test-orders/{id}`   | **PUT**    | 200 OK               | Update an order by ID (API key required) |
| `/test-orders/{id}`   | **DELETE** | 204 No Content       | Delete an order by ID (API key required) |