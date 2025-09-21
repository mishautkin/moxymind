
import {
	LoginPage,
	InventoryPage,
	InventoryItem,
	SideMenu,
	CartPage,
	CheckoutPage1,
	CheckoutPage2,
	CheckoutPage3,
	RestClient,
} from '../utils';

/**
 * Additional fixtures for playwright test
 */
export type TestExtend = {
	loginPage: LoginPage;
	inventoryPage: InventoryPage;
	inventoryItem: InventoryItem;
	sideMenu: SideMenu;
	cartPage: CartPage;
	checkoutPage1: CheckoutPage1;
	checkoutPage2: CheckoutPage2;
	checkoutPage3: CheckoutPage3;
	restClient: RestClient;
};

// API Response Types for reqres.in

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Support {
  url: string;
  text: string;
}

export interface ListUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse extends CreateUserRequest {
  id: string;
  createdAt: string;
}

export interface SingleUserResponse {
  data: User;
  support: Support;
}

export interface ApiError {
  error?: string;
  message?: string;
}