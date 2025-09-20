import { test as setup } from '../../utils';
import { password, users } from './_test.data';

setup( 'Setup standard user state', async ( { page, loginPage } ) => {
  await loginPage.visit();
  await loginPage.login( users.standard, password )
  await page.context().storageState( { path: process.env.STORAGE_STATE_SAUCEDEMO } );
} );