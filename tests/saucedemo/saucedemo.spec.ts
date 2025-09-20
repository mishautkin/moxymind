import { test, expect } from '../../utils';
import { users, password, products, taxRate, currency } from './_test.data';


test.describe( 'Authorization tests', () => {

  test(
    'TC-01 | Login/logout functionality with different user types',
    async ( {
      loginPage,
      inventoryPage,
      sideMenu,
    } ) => {
      await test.step( 'Login with empty credentials', async () => {
        await loginPage.visit();
        await loginPage.login( '', '' );
        await loginPage.assertErrorMessage(
          'Epic sadface: Username is required'
        );
        await loginPage.assertPageUrl();
      } );

      await test.step( 'Login with invalid credentials', async () => {
        await loginPage.visit();
        await loginPage.login( 'invalid_user', 'invalidPassword' );
        await loginPage.assertErrorMessage(
          'Epic sadface: Username and password do not match any user in this service'
        );
        await loginPage.assertPageUrl();
      } );
      
      await test.step( 'Login with locked out user', async () => {
        await loginPage.visit();
        await loginPage.login( users.lockedOut, password );
        await loginPage.assertErrorMessage(
          'Epic sadface: Sorry, this user has been locked out'
        );
        await loginPage.assertPageUrl();
      } );

      await test.step( 'Login with standard user', async () => {
        await loginPage.visit();
        await loginPage.login( users.standard, password );
        await inventoryPage.assertPageView();
      } );

      await test.step( 'Logout user', async () => {
        await sideMenu.open();
        await sideMenu.logout();
        await loginPage.assertPageView();
      } );
  } );
} );


test.describe( 'Web-shop tests', () => {
  // Use storage state to avoid login before each test
  test.use( { storageState: process.env.STORAGE_STATE_SAUCEDEMO } );

  test(
    'TC-02 | Product browsing and cart management',
    async ( {
      inventoryPage,
      cartPage,
    } ) => {
      const { backpack, bikeLight, tshirt } = products;

      await inventoryPage.visit();
      
      await test.step( 'Add items to cart and verify count', async () => {
        // Add first item
        await inventoryPage.addItemToCart( backpack.slug );
        await expect( await inventoryPage.getCartItemCount() ).toEqual( 1 );

        // Add second item
        await inventoryPage.addItemToCart( bikeLight.slug );
        await expect( await inventoryPage.getCartItemCount() ).toEqual( 2 );

        // Add third item
        await inventoryPage.addItemToCart( tshirt.slug );
        await expect( await inventoryPage.getCartItemCount() ).toEqual( 3 );
      } );

      await test.step( 'Remove item from inventory page', async () => {
        await inventoryPage.removeItemFromCart( bikeLight.slug );
        await expect( await inventoryPage.getCartItemCount() ).toEqual( 2 );
      } );

      await test.step( 'Verify cart contents', async () => {
        await inventoryPage.cartLink().click();
        await cartPage.assertPageView();

        // Check that correct items are in cart
        await expect( cartPage.cartItemNames().first() ).toContainText( backpack.name );
        await expect( cartPage.cartItemNames().nth(1) ).toContainText( tshirt.name );

        // Verify removed item is not in cart
        await expect( cartPage.page.getByText( bikeLight.name ) ).not.toBeVisible();
      } );

      // Test 2.4: Remove item from cart page
      await test.step('Remove item from cart page', async () => {
        await cartPage.removeItemFromCart( tshirt.slug );
        await expect( await cartPage.getCartItemCount() ).toBe( 1 );
        await expect( cartPage.page.getByText( tshirt.name ) ).not.toBeVisible();
      } );
  });
  
  test(
    'TC-03 | Complete checkout process',
    async ( {
      inventoryPage,
      cartPage,
      checkoutPage1,
      checkoutPage2,
      checkoutPage3,
    } ) => {
      const { backpack, jacket } = products;

      await inventoryPage.visit();
      
      await test.step('Add items for checkout', async () => {
        await inventoryPage.addItemToCart( backpack.slug );
        await inventoryPage.addItemToCart( jacket.slug );
        await expect( await inventoryPage.getCartItemCount() ).toBe( 2 );
      });

      // Proceed to checkout
      await test.step('Navigate to checkout', async () => {
        await inventoryPage.cartLink().click();
        await cartPage.checkoutButton().click();
        // Verify checkout step 1 is opened
        await checkoutPage1.assertPageView();
      });

      // Fill checkout information
      await test.step('Fill checkout information', async () => {
        await checkoutPage1.fillCheckoutFormAndContinue( 'Moxy', 'Mind', '01234' );
        // Verify checkout step 2 is opened
        await checkoutPage2.assertPageView();
      });

      // Verify order summary
      await test.step('Verify order summary', async () => {
        await expect( checkoutPage2.checkoutItemNames().first() ).toContainText( backpack.name );
        await expect( checkoutPage2.checkoutItemNames().nth(1) ).toContainText( jacket.name );

        // Verify Price Total
        const expectedSubtotal = Number( ( parseFloat( backpack.price ) + parseFloat( jacket.price ) ).toFixed( 2 ) );
        const expectedTax = Number( ( expectedSubtotal * parseFloat( taxRate ) ).toFixed( 2 ) );
        const expectedTotal = Number( ( expectedSubtotal + expectedTax ).toFixed( 2 ) );

        await expect( checkoutPage2.subtotalLabel() ).toContainText( `${ currency.symbol }${ expectedSubtotal }` );
        await expect( checkoutPage2.taxLabel() ).toContainText( `${ currency.symbol }${ expectedTax }` );
        await expect( checkoutPage2.totalLabel() ).toContainText( `${ currency.symbol }${ expectedTotal }` );
      });

      await test.step('Complete the order', async () => {
        await checkoutPage2.finishButton().click();
        // Verify checkout step 2 is opened
        await checkoutPage3.assertPageView();
        await checkoutPage3.assertOrderComplete();

        // Verify we can go back to home
        await checkoutPage3.backHomeButton().click();
        await inventoryPage.assertPageView();

        // Cart should be empty after successful order
        await expect( await inventoryPage.getCartItemCount() ).toBe( 0 );
      });
  });
  
  test('TC-04 | Product sorting and UI validation',
    async ( {
      inventoryPage,
    } ) => {
      const { backpack, allTheThings } = products;

      await inventoryPage.visit();

      await test.step( 'Verify default sort (A-Z)', async () => {
        await expect(
          await inventoryPage.productNames().first()
        ).toContainText( backpack.name );
      } );

      await test.step( 'Sort by name Z-A', async () => {
        await inventoryPage.sortProducts( 'za' );

        // Wait for sort to complete and verify
        await inventoryPage.page.waitForTimeout( 1000 );
        await expect(
          await inventoryPage.productNames().first()
        ).toContainText( allTheThings.name );
      } );

      await test.step( 'Sort by price low to high', async () => {
        await inventoryPage.sortProducts( 'lohi' );

        await inventoryPage.page.waitForTimeout( 1000 );
        const prices = await inventoryPage.productPrices().allTextContents();
        const priceNumbers = prices.map( price => parseFloat( price.replace( '$', '' ) ) );

        // Verify prices are in ascending order
        for ( let i = 1; i < priceNumbers.length; i++ ) {
          expect( priceNumbers[ i ] ).toBeGreaterThanOrEqual( priceNumbers[ i - 1 ] );
        }
      } );

      await test.step( 'Sort by price high to low', async () => {
        await inventoryPage.sortProducts( 'hilo' );

        await inventoryPage.page.waitForTimeout( 1000 );
        const prices = await inventoryPage.productPrices().allTextContents();
        const priceNumbers = prices.map( price => parseFloat( price.replace( '$', '' ) ) );

        // Verify prices are in descending order
        for (let i = 1; i < priceNumbers.length; i++) {
          expect( priceNumbers[ i ] ).toBeLessThanOrEqual( priceNumbers[ i - 1 ] );
        }
      } );

      await test.step( 'Verify all product elements are displayed', async () => {
        const productCount = await inventoryPage.productItems().count();

        expect( productCount ).toBeGreaterThan( 0 );

        // Check each product has name, price
        for ( let i = 0; i < productCount; i++ ) {
          await expect( inventoryPage.productNames().nth( i ) ).toBeVisible();
          await expect( inventoryPage.productPrices().nth( i ) ).toBeVisible();
        }
      } );
  });
});
