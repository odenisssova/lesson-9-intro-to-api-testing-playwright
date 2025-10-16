# Lesson 9 — API Testing with Playwright

This project contains API tests implemented with Playwright.
The task to cover basic API requests such as: GET, PUT, DELETE and to check the response status code.

## API Testing Checklist

| Endpoint            | Method     | Expected Status Code | Notes                 |
| ------------------- | ---------- | -------------------- | --------------------- |
| `/test-orders/{id}` | **GET**    | 200 (OK)             | Get order by ID       |
| `/test-orders/{id}` | **PUT**    | 200 OK               | Update existing order |
| `/test-orders/{id}` | **DELETE** | 204 (No Content)     | Delete existing order |

### Risk API Checklist

Loan endpoint - Method POST - /api/loan-calc/decision

| #   | Case                                       | Input                                                                                                | Expected Status Code | Expected Result (Soft Checks)                                                                                        |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | **Low risk** (positive decision)           | `{ "income": 8500, "debt": 500, "age": 28, "employed": true, "loanAmount": 800, "loanPeriod": 12 }`  | **200 OK**           | `riskLevel === "Low Risk"`, `riskDecision === "positive"`, `riskScore: number`, `riskPeriods - {12, 18, 24, 30, 36}` |
| 2   | **Medium risk** (positive decision)        | `{ "income": 4500, "debt": 1000, "age": 35, "employed": true, "loanAmount": 1200, "loanPeriod": 9 }` | **200 OK**           | `riskLevel === "Medium Risk"`, `riskDecision === "positive"`, `riskScore: number`, `riskPeriods - {6, 9, 12}`        |
| 3   | **High risk** (positive decision)          | `{ "income": 800, "debt": 200, "age": 22, "employed": true, "loanAmount": 2000, "loanPeriod": 6 }`   | **200 OK**           | `riskLevel === "High Risk"`, `riskDecision === "positive"`, `riskScore: number`, `riskPeriods - {3, 6}`              |
| 4   | **Very high risk** (negative decision)     | `{ "income": 500, "debt": 1800, "age": 17, "employed": true, "loanAmount": 2500, "loanPeriod": 6 }`  | **200 OK**           | `riskLevel === "Very High Risk"`, `riskDecision === "negative"`, `riskScore: number`, `riskPeriods - {}`             |
| 5   | **Invalid — zero income**                  | `{ "income": 0, "debt": 100, "age": 30, "employed": true, "loanAmount": 1000, "loanPeriod": 12 }`    | **400 Bad Request**  | validation error message                                                                                             |
| 6   | **Invalid — negative debt**                | `{ "income": 3000, "debt": -50, "age": 32, "employed": true, "loanAmount": 800, "loanPeriod": 12 }`  | **400 Bad Request**  | validation error message                                                                                             |
| 7   | **Underage applicant (rule not enforced)** | `{ "income": 100, "debt": 0, "age": 15, "employed": ture, "loanAmount": 600, "loanPeriod": 6 }`      | **200 OK**           | `riskLevel === "High Risk"`, `riskDecision === "positive"`, `riskScore: number`, `riskPeriods - {3, 6}`              |
| 8   | **Unemployed applicant**                   | `{ "income": 100, "debt": 0, "age": 60", employed": false, "loanAmount": 1000, "loanPeriod": 12 }`   | **200 OK**           | `riskLevel === "Very High Risk"`, `riskDecision === "negative"`, `riskScore: number`, `riskPeriods - {}`             |

Known deviation: Although Swagger states age > 16, the current backend accepts age <= 16 and returns 200 with a high risk result. Tests reflect the actual behavior.
