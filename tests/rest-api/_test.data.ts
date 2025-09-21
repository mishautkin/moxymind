import { CreateUserRequest } from '../../resources/types';

export const testData = {
  // Valid user data for creation
  validUser: {
    name: 'Miro Barkovic',
    job: 'QA Engineer'
  } as CreateUserRequest,

  // Alternative user data
  alternativeUser: {
    name: 'Jana Smithova', 
    job: 'Software Developer'
  } as CreateUserRequest,

  // User with special characters
  specialCharUser: {
    name: 'Erik Remark',
    job: 'Senior Architect'
  } as CreateUserRequest,

  // Empty data for negative testing
  emptyUser: {
    name: '',
    job: ''
  } as CreateUserRequest,

  // Expected values for assertions
  expected: {
    defaultPage: 1,
    defaultPerPage: 6,
    totalUsers: 12,
    totalPages: 2,
    knownUserIds: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
    knownUserEmail: 'janet.weaver@reqres.in', // User ID 2
    supportUrl: 'https://reqres.in/#support-heading',
    contentType: 'application/json; charset=utf-8'
  },

  // Pagination test cases
  pagination: {
    page1: { page: 1, expected: { page: 1, per_page: 6 } },
    page2: { page: 2, expected: { page: 2, per_page: 6 } },
    customPerPage: { page: 1, per_page: 3, expected: { page: 1, per_page: 3 } }
  }
};

/**
 * Generate unique test data
 */
export function generateUniqueUserData() {
  const timestamp = Date.now();
  return {
    name: `TestUser_${timestamp}`,
    job: `TestJob_${timestamp}`
  };
}