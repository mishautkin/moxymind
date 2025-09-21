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
- **`InventoryItem`**: Component class encapsulates page locators, actions and assertions for inventory item (fixture `inventoryItem`). Doesn't extend `BasePage` since represents only a part of page.
- **`SideMenu`**: Component class encapsulates locators, actions and assertions for side menu (fixture sideMenu). Doesn't extend `BasePage` since represents only a part of page.
- **`CartPage`**: POM class encapsulates page locators, actions and assertions for cart page (fixture `cartPage`). Extends `BasePage`.
- **`CheckoutPage1`**: POM class encapsulates page locators, actions and assertions for checkout information page (fixture `checkoutPage1`). Extends `BasePage`.
- **`CheckoutPage2`**: POM class encapsulates page locators, actions and assertions for checkout overview page (fixture `checkoutPage2`). Extends `BasePage`.
- **`CheckoutPage3`**: POM class encapsulates page locators, actions and assertions for checkout confirmation page (fixture `checkoutPage3`). Extends `BasePage`.

### Test Organization

Autotests are located in `/tests/saucedemo/` directory.

- **_test.setup**: setup for `standard_user` storage state.
- **_test.data**: File with data used in autotests (user creds, products, etc.).
- **saucedemo.spec**: Spec file with autotests

Autotests in spec file are logically distributed into `test.describe` blocks. **Web-shop tests** utilize storage state created by `_test.setup` to avoid login before each test.

## Test Cases

### TC-01 | Login/logout functionality with different user types

**Why This Functionality is Essential:**

Authentication is the foundation of any secure web application. It is critical for security and user experience, especially in e-commerce where sensitive user data and transactions are involved.

**Test Steps / Expected Results:**

- Empty credentials validation ⇒ Error message "Epic sadface: Username is required" appears
- Invalid credentials validation ⇒ Error message "Epic sadface: Username and password do not match any user in this service" appears  
- Locked out user error handling ⇒ Error message "Epic sadface: Sorry, this user has been locked out" appears
- Valid login with standard user ⇒ User redirected to inventory page
- Logout functionality ⇒ User redirected to login page, session cleared, subsequent access to protected pages blocked

**User Types Tested:** `standard_user`, `locked_out_user`, invalid user, empty credentials.

### TC-02 | Product Browsing and Cart Management

**Why This Functionality is Essential:**

Smooth, flawless and intuitive cart functionality is the core of any e-commerce application. It directly impacts conversion rates and user satisfaction.

**Test Steps / Expected Results:**

- Add multiple items to cart ⇒ Cart badge shows correct count (1, 2, 3...) and "Add to cart" buttons change to "Remove"
- Remove items from inventory page ⇒ Cart count decreases, "Remove" buttons change back to "Add to cart"
- Cart item count validation ⇒ Cart badge displays accurate number reflecting actual items in cart
- Cart contents verification ⇒ Cart page shows correct products with names, prices, and quantities matching selections
- Remove items from cart page ⇒ Items disappear from cart, cart count updates, total price recalculates

**Validation:** Cart state persistence and UI updates should remain consistent across page navigation.

### TC-03 | Complete Checkout Process

**Why This Functionality is Essential:**

The checkout process is the conversion point from browsing to purchasing. Checkout failures directly impact revenue. Current flow ensures users can successfully complete purchases, form validations work correctly and necessary transaction details are provided.

**Test Steps / Expected Results:**

- Full checkout flow for `standard_user` ⇒ User navigates seamlessly from cart → checkout info → overview → completion
- Checkout form validation ⇒ Required fields (First Name, Last Name, Postal Code) must be filled; error messages appear for missing data
- Order summary verification ⇒ Checkout overview shows correct items, prices, tax calculation (8%), and total ($39.98 subtotal + $3.20 tax = $43.18 total)
- Order completion confirmation ⇒ Success page displays "Thank you for your order!" with order completion message
- Validate that Cart is reset after successful order ⇒ Cart badge disappears, cart page shows empty state, inventory page shows all "Add to cart" buttons

**Validation:** Flawless Checkout happy path scenario.

### TC-04 | Product Sorting and UI Validation

**Why This Functionality is Essential:**

Proper sorting functionality is crucial for product discovery and helps users make decisions. UI validation ensures the interface responds correctly and no data is lost.

**Test Steps / Expected Results:**
- Sort by name (A-Z) ⇒ Products appear alphabetically from "Sauce Labs Backpack" to "Test.allTheThings() T-Shirt (Red)"
- Sort by name (Z-A) ⇒ Products appear reverse alphabetically from "Test.allTheThings() T-Shirt (Red)" to "Sauce Labs Backpack"  
- Sort by price (Low-High) ⇒ Products ordered from $7.99 (Sauce Labs Onesie) to $49.99 (Sauce Labs Fleece Jacket)
- Sort by price (High-Low) ⇒ Products ordered from $49.99 (Sauce Labs Fleece Jacket) to $7.99 (Sauce Labs Onesie)
- Product element presence validation ⇒ Each product displays name, price, image, description, and "Add to cart" button
- Price sorting algorithm verification ⇒ Mathematical validation that prices are in correct ascending/descending order

**Validation:** Expected UI updates occur immediately, data consistency is maintained.

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
