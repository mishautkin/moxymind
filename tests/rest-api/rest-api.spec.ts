import { test, expect } from '../../utils/test';
import { generateUniqueUserData, testData } from './_test.data';
import { CreateUserResponse } from '../../resources/types';
  
test.beforeAll(async ( { restClient } ) => {
  // Validate API accessibility before running tests
  const response = await restClient.makeRequest( 'get', '/users?page=1' );
  expect( response.ok, 'API should be accessible' ).toBeTruthy();
} );

test.describe( 'GET - List Users', () => {
  
  test( 'REST-01 | Retrieve list of users with default pagination', async ( { restClient } ) => {
    // Act
    const response = await restClient.getUsers();
    
    // Assert - Response structure
    expect( response ).toHaveProperty( 'page' );
    expect( response ).toHaveProperty( 'per_page' );
    expect( response ).toHaveProperty( 'total' );
    expect( response ).toHaveProperty( 'total_pages' );
    expect( response ).toHaveProperty( 'data' );
    expect( response ).toHaveProperty( 'support' );
    
    // Assert - Default values
    expect( response.page ).toBe( testData.expected.defaultPage );
    expect( response.per_page ).toBe( testData.expected.defaultPerPage );
    expect( response.total ).toBe( testData.expected.totalUsers );
    expect( response.total_pages ).toBe( testData.expected.totalPages );
    
    // Assert - Data array
    expect( Array.isArray( response.data ) ).toBeTruthy();
    expect( response.data.length ).toBeLessThanOrEqual( response.per_page );
    expect( response.data.length ).toBeGreaterThan( 0 );
    
    // Assert - User object structure
    response.data.forEach( user => {
      expect( user ).toHaveProperty( 'id' );
      expect( user ).toHaveProperty( 'email' );
      expect( user ).toHaveProperty( 'first_name' );
      expect( user ).toHaveProperty( 'last_name' );
      expect( user ).toHaveProperty( 'avatar' );
      
      // Validate data types
      expect( typeof user.id ).toBe( 'number' );
      expect( typeof user.email ).toBe( 'string' );
      expect( typeof user.first_name ).toBe( 'string' );
      expect( typeof user.last_name ).toBe( 'string' );
      expect( typeof user.avatar ).toBe( 'string' );
      
      // Validate email format
      expect( user.email ).toMatch( /^[^\s@]+@[^\s@]+\.[^\s@]+$/ );
      
      // Validate avatar URL format
      expect( user.avatar ).toMatch( /^https?:\/\/.+/ );
    } );
    
    // Assert - Support object
    expect( response.support ).toHaveProperty( 'url' );
    expect( response.support ).toHaveProperty( 'text' );
    expect( response.support.url ).toBe( testData.expected.supportUrl );
    expect( typeof response.support.text ).toBe( 'string' );
    expect( response.support.text.length ).toBeGreaterThan(0);
  } );

  test( 'REST-02 | Retrieve users with specific pagination', async ( { restClient } ) => {
    // Arrange
    const page = 2;
    const perPage = 3;
    
    // Act
    const response = await restClient.getUsers( page, perPage );
    
    // Assert - Pagination values
    expect( response.page ).toBe( page );
    expect( response.per_page ).toBe( perPage );
    expect( response.data.length ).toBeLessThanOrEqual( perPage );
    
    // Assert - User IDs are unique and valid
    const userIds = response.data.map( user => user.id );
    const uniqueIds = [ ...new Set( userIds ) ];
    expect( userIds.length ).toBe( uniqueIds.length ); // No duplicates
    
    userIds.forEach(id => {
      expect( testData.expected.knownUserIds ).toContain(id);
    } );
  } );

  test( 'REST-03 | Handle non-existent page gracefully', async ( { restClient } ) => {
    // Arrange
    const nonExistentPage = 999;
    
    // Act
    const response = await restClient.getUsers( nonExistentPage );
    
    // Assert - Empty data but valid response structure
    expect( response.page ).toBe( nonExistentPage );
    expect( response.data ).toEqual( [] );
    expect( response.total ).toBe( testData.expected.totalUsers );
    expect( response.total_pages ).toBe( testData.expected.totalPages );
  } );

  test( 'REST-04 | Validate response headers and status', async ( { restClient } ) => {
    // Act
    const apiResponse = await restClient.makeRequest( 'get', '/users' );
    
    // Assert - Status code
    expect( apiResponse.status ).toBe(200);
    expect( apiResponse.ok ).toBeTruthy();
    
    // Assert - Headers
    expect( apiResponse.headers['content-type'] ).toContain( 'application/json' );
    expect( apiResponse.headers ).toHaveProperty( 'server' );
    expect( apiResponse.headers ).toHaveProperty( 'cache-control' );
  } );
} );

test.describe( 'POST - Create User', () => {
  
  test( 'REST-05 | Create a user with valid data', async ( { restClient } ) => {
    // Arrange
    const userData = testData.validUser;
    
    // Act
    const response = await restClient.createUser( userData );
    
    // Assert - Response structure
    expect( response ).toHaveProperty( 'id' );
    expect( response ).toHaveProperty( 'name' );
    expect( response ).toHaveProperty( 'job' );
    expect( response ).toHaveProperty( 'createdAt' );
    
    // Assert - Response data matches request
    expect( response.name ).toBe( userData.name );
    expect( response.job ).toBe( userData.job );
    
    // Assert - Generated fields
    expect( response.id ).toBeDefined();
    expect( typeof response.id ).toBe( 'string' );
    expect( response.id.length ).toBeGreaterThan( 0 );
    
    // Assert - CreatedAt timestamp
    expect( response.createdAt ).toBeDefined();
    expect( new Date( response.createdAt ).getTime() ).toBeGreaterThan( 0 );
    
    // Validate timestamp is recent (within last minute)
    const createdTime = new Date( response.createdAt ).getTime();
    const currentTime = Date.now();
    const oneMinute = 60 * 1000;
    expect( createdTime ).toBeGreaterThan( currentTime - oneMinute );
    expect( createdTime ).toBeLessThanOrEqual( currentTime + oneMinute );
  } );

  test( 'REST-06 | Create user with special characters in data', async ( { restClient } ) => {
    // Arrange
    const userData = testData.specialCharUser;
    
    // Act
    const response = await restClient.createUser(userData);
    
    // Assert - Special characters are preserved
    expect( response.name ).toBe(userData.name);
    expect( response.job ).toBe(userData.job);
    expect( response.name ).toContain( 'é' );
    expect( response.name ).toContain( 'í' );
  } );

  test( 'REST-07 | Create multiple users with unique data', async ( { restClient } ) => {
    // Arrange
    const user1Data = generateUniqueUserData();
    const user2Data = generateUniqueUserData();
    
    // Act
    const response1 = await restClient.createUser(user1Data);
    const response2 = await restClient.createUser(user2Data);
    
    // Assert - Both users created successfully
    expect( response1.name ).toBe(user1Data.name);
    expect( response2.name ).toBe(user2Data.name);
    expect( response1.job ).toBe(user1Data.job);
    expect( response2.job ).toBe(user2Data.job);
    
    // Assert - Unique IDs assigned
    expect( response1.id ).not.toBe(response2.id);
  } );

  test( 'REST-08 | Validate response status and headers for POST', async ( { restClient, request } ) => {
    // Arrange
    const userData = testData.alternativeUser;
    
    // Act
    const apiResponse = await restClient.makeRequest( 'post', '/users', userData);
    
    // Assert - Status code
    expect( apiResponse.status ).toBe(201); // Created status
    expect( apiResponse.ok ).toBeTruthy();
    
    // Assert - Headers
    expect( apiResponse.headers['content-type'] ).toContain( 'application/json' );
    
    // Assert - Response body
    const responseBody = apiResponse.body as CreateUserResponse;
    expect( responseBody.name ).toBe(userData.name);
    expect( responseBody.job ).toBe(userData.job);
  } );

  test( 'REST-09 | Handle empty user data', async ( { restClient } ) => {
    // Arrange
    const emptyData = testData.emptyUser;
    
    // Act & Assert
    // Note: reqres.in accepts empty data, so we validate it still creates a user
    const response = await restClient.createUser( emptyData );
    
    expect( response ).toHaveProperty( 'id' );
    expect( response ).toHaveProperty( 'createdAt' );
    expect( response.name ).toBe( '' );
    expect( response.job ).toBe( '' );
  } );
} );

test.describe( 'Error Handling and Edge Cases', () => {
  
  test( 'REST-10 | Handle malformed JSON in POST request', async ( { restClient } ) => {
    // Arrange
    const malformedData = '{"name": "Test", "job":}'; // Invalid JSON
    
    // Act
    const response = await restClient.makeRequest( 'post', '/users', malformedData );
    
    // Assert - Should handle gracefully
    expect( response.status ).toBeGreaterThanOrEqual( 400 );
  } );

  test( 'REST-11 | Validate API response time', async ( { restClient } ) => {
    // Arrange
    const startTime = Date.now();
    
    // Act
    await restClient.getUsers();
    const endTime = Date.now();
    
    // Assert - Response time should be reasonable (less than 5 seconds)
    const responseTime = endTime - startTime;
    expect( responseTime ).toBeLessThan( 5000 );
  } );
} );
