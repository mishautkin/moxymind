# Saucedemo Autotests

Playwright (TypeScript) test automation suite for https://www.saucedemo.com/.

## Table of Content

- [Architecture](#architecture)
  - [Page Object Model (POM) Pattern](#page-object-model-pom-pattern)
  - [Test Organization](#test-organization)
- [Test Cases](#test-cases)
- [Test Data](#test-data)

## Architecture

### Page Object Model (POM) Pattern

The test suite uses POM pattern with corresponding fixtures for each tested page.

Following classes are located in `/utils/` directory:

- **`BasePage`**: Parent class for other pages. Encapsulates page locators, actions and assertions common for all pages (has no fixture).
- **`LoginPage`**: POM class encapsulates page locators, actions and assertions for login page (fixture `loginPage`). Extends `BasePage`.
- **`InventoryPage`**: POM class encapsulates page locators, actions and assertions for inventory page (fixture `inventoryPage`). Extends `BasePage`.
- **`CartPage`**: POM class encapsulates page locators, actions and assertions for cart page (fixture `cartPage`). Extends `BasePage`.
- **`CheckoutPage1`**: POM class encapsulates page locators, actions and assertions for checkout information page (fixture `checkoutPage1`). Extends `BasePage`.
- **`CheckoutPage2`**: POM class encapsulates page locators, actions and assertions for checkout overview page (fixture `checkoutPage2`). Extends `BasePage`.
- **`CheckoutPage3`**: POM class encapsulates page locators, actions and assertions for checkout confirmation page (fixture `checkoutPage3`). Extends `BasePage`.
- **`SideMenu`**: POM class encapsulates locators, actions and assertions for side menu (fixture sideMenu). Doesn't extend `BasePage` since represents only a part of page.

### Test Organization

Autotests are located in `/tests/saucedemo/` directory.

- **_test.setup**: setup for `standard_user` storage state.
- **_test.data**: File with data used in autotests (user creds, products, etc.).
- **saucedemo.spec**: Spec file with autotests

Autotests in spec file are logically distributed into `test.describe` blocks. **Web-shop tests** utilize storage state created by `_test.setup` to avoid login before each test.

## Test Cases

### TC-01 | Login/logout functionality with different user types

- **Objective**: Validate authentication with different user types
- **Coverage**:
  - Empty credentials validation
  - Invalid credentials validation
  - Locked out user error handling
  - Valid login with standard user
  - Logout functionality
- **User Types Tested**: `standard_user`, `locked_out_user`, invalid user, empty credentials

### TC-02 | Product Browsing and Cart Management

- **Objective**: Products inventory interaction and cart functionality
- **Coverage**:
  - Add multiple items to cart
  - Remove items from inventory page
  - Cart item count validation
  - Cart contents verification
  - Remove items from cart page
- **Validation**: Cart state persistence and UI updates

### TC-03 | Complete Checkout Process

- **Objective**: End-to-end purchase workflow validation
- **Coverage**:
  - Full checkout flow for `standard_user`
  - Checkout form validation
  - Order summary verification
  - Order completion confirmation
  - Validate that Cart is reset after successful order
- **Workflow**: Add Items => Checkout => Fill Info => Complete Order => Back to web-shop

### TC-04 | Product Sorting and UI Validation

- **Objective**: Test product display and sorting functionality
- **Coverage**:
  - Sort by name (A-Z, Z-A)
  - Sort by price (Low-High, High-Low)
  - Product element presence validation
  - Price sorting algorithm verification
- **Validation**: expected UI updates, data consistency

## Test Data

### Login Credentials

- **Standard User**: `standard_user` / `secret_sauce`
- **Locked User**: `locked_out_user` / `secret_sauce` (should fail)
- **Problem User**: `problem_user` / `secret_sauce` (UI issues)
- **Performance User**: `performance_glitch_user` / `secret_sauce` (slow)

### Test Products

- Sauce Labs Backpack
- Sauce Labs Bike Light  
- Sauce Labs Bolt T-Shirt
- Sauce Labs Fleece Jacket
- Sauce Labs Onesie
- Test.allTheThings() T-Shirt (Red)

### Test Checkout Options

- Tax rate: 8%
- Currency: USD, $
