# REST API Test Automation

Playwright (TypeScript) test automation suite for [reqres.in](https://reqres.in/) API endpoints.

## Table of Content

- [Architecture](#architecture)
  - [Rest Client](#rest-client)
  - [Test Organization](#test-organization)
- [Test Cases](#test-cases)
- [Test Data](#test-data)

## Architecture

### Rest Client

The test suite utilizes REST API client class with corresponding `restClient` fixture for API testing.

`RestClient` class and fixture declaration are located in `/utils/` directory:

- **`RestClient`**: REST API client class, encapsulates genetic HTTP request method and all request methodsused in tests.
- **`test.ts`**: contains declaration for `restClient` fixture.

**`RestClient` class requires environment variables and secrets (see [Environment Variables](../README.md#environment-variables) section) to be set.**

### Test Organization

Autotests are located in `/tests/rest-api/` directory.

- **_test.data**: File with test data used in autotests (user data, expected values, pagination scenarios).
- **rest-api.spec**: Spec file with REST API autotests organized into logical test suites.

Autotests in spec file are logically distributed into `test.describe` blocks: **GET - List Users**, **POST - Create User**, and **Error Handling and Edge Cases**.

## Test Cases

### GET - List Users Functionality

**Tests / Expected Results:**

- **REST-01** Default pagination validation → Response contains page=1, per_page=6, total=12, total_pages=2 with valid user array
- **REST-02** Custom pagination parameters → Correct page and per_page values returned, user IDs are unique and valid  
- **REST-03** Non-existent page handling → Empty data array returned but valid response structure maintained
- **REST-04** Response headers and status → HTTP 200 status with proper content-type, server, and cache-control headers

**Validation:** User objects contain required fields (id, email, first_name, last_name, avatar) with correct data types, valid email formats, and proper avatar URLs. Support object contains valid URL and descriptive text.

### POST - Create User Functionality

**Tests / Expected Results:**

- **REST-05** Valid user creation → HTTP 201 status, response contains id, name, job, createdAt fields with generated ID and recent timestamp
- **REST-06** Special characters handling → Unicode characters (José María) preserved correctly in response
- **REST-07** Multiple user creation → Unique IDs assigned to different users, all data preserved accurately
- **REST-08** Response validation → Proper content-type headers, HTTP 201 status, request data matches response data
- **REST-09** Empty data handling → Empty strings accepted and returned, user still created with generated ID

**Validation:** Response structure matches `CreateUserResponse` interface with flat structure (id, name, job, createdAt). Timestamps are recent and properly formatted. Generated IDs are unique strings.

### Error Handling and Edge Cases

**Tests / Expected Results:**

- **REST-10** Malformed JSON handling → HTTP 400+ status returned for invalid JSON payload  
- **REST-11** Response time validation → API responses complete within 5 seconds for acceptable performance

**Validation:** Error conditions handled gracefully without application crashes. Performance requirements met consistently.

## Test Data

### User Test Data

**Valid Users:**
- Standard User: `Miro Barkovic` / `QA Engineer`
- Alternative User: `Jana Smithova` / `Software Developer`  
- Special Characters: `José María` / `Senior Architect`
- Empty Data: `""` / `""`

**Generated Test Data:**
- Unique users with timestamp-based names: `TestUser_[timestamp]` / `TestJob_[timestamp]`

### API Response Expectations

**Pagination Values:**
- Default page: 1
- Default per_page: 6  
- Total users: 12
- Total pages: 2
- Known user IDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

**Response Validation:**
- Support URL: `https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral`
- Content-Type: `application/json; charset=utf-8`
- Performance threshold: < 5000ms response time