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
    const response = await restClient.getUsers();
    
    expect( response ).toHaveProperty( 'page' );
    expect( response ).toHaveProperty( 'per_page' );
    expect( response ).toHaveProperty( 'total' );
    expect( response ).toHaveProperty( 'total_pages' );
    expect( response ).toHaveProperty( 'data' );
    expect( response ).toHaveProperty( 'support' );
    
    expect( response.page ).toBe( testData.expected.defaultPage );
    expect( response.per_page ).toBe( testData.expected.defaultPerPage );
    expect( response.total ).toBe( testData.expected.totalUsers );
    expect( response.total_pages ).toBe( testData.expected.totalPages );
    
    expect( Array.isArray( response.data ) ).toBeTruthy();
    expect( response.data.length ).toBeLessThanOrEqual( response.per_page );
    expect( response.data.length ).toBeGreaterThan( 0 );
    
    response.data.forEach( user => {
      expect( user ).toHaveProperty( 'id' );
      expect( user ).toHaveProperty( 'email' );
      expect( user ).toHaveProperty( 'first_name' );
      expect( user ).toHaveProperty( 'last_name' );
      expect( user ).toHaveProperty( 'avatar' );
      
      expect( typeof user.id ).toBe( 'number' );
      expect( typeof user.email ).toBe( 'string' );
      expect( typeof user.first_name ).toBe( 'string' );
      expect( typeof user.last_name ).toBe( 'string' );
      expect( typeof user.avatar ).toBe( 'string' );
      
      expect( user.email ).toMatch( /^[^\s@]+@[^\s@]+\.[^\s@]+$/ );
      expect( user.avatar ).toMatch( /^https?:\/\/.+/ );
    } );
    
    expect( response.support ).toHaveProperty( 'url' );
    expect( response.support ).toHaveProperty( 'text' );
    expect( response.support.url ).toBe( testData.expected.supportUrl );
    expect( typeof response.support.text ).toBe( 'string' );
    expect( response.support.text.length ).toBeGreaterThan(0);
  } );

  test( 'REST-02 | Retrieve users with specific pagination', async ( { restClient } ) => {
    const page = 2;
    const perPage = 3;
    
    const response = await restClient.getUsers( page, perPage );
    
    expect( response.page ).toBe( page );
    expect( response.per_page ).toBe( perPage );
    expect( response.data.length ).toBeLessThanOrEqual( perPage );
    
    const userIds = response.data.map( user => user.id );
    const uniqueIds = [ ...new Set( userIds ) ];
    expect( userIds.length ).toBe( uniqueIds.length );
    
    userIds.forEach(id => {
      expect( testData.expected.knownUserIds ).toContain(id);
    } );
  } );

  test( 'REST-03 | Handle non-existent page gracefully', async ( { restClient } ) => {
    const nonExistentPage = 999;
    
    const response = await restClient.getUsers( nonExistentPage );
    
    expect( response.page ).toBe( nonExistentPage );
    expect( response.data ).toEqual( [] );
    expect( response.total ).toBe( testData.expected.totalUsers );
    expect( response.total_pages ).toBe( testData.expected.totalPages );
  } );

  test( 'REST-04 | Validate response headers and status', async ( { restClient } ) => {
    const apiResponse = await restClient.makeRequest( 'get', '/users' );
    
    expect( apiResponse.status ).toBe(200);
    expect( apiResponse.ok ).toBeTruthy();
    
    expect( apiResponse.headers['content-type'] ).toContain( 'application/json' );
    expect( apiResponse.headers ).toHaveProperty( 'server' );
    expect( apiResponse.headers ).toHaveProperty( 'cache-control' );
  } );
} );

test.describe( 'POST - Create User', () => {
  
  test( 'REST-05 | Create a user with valid data', async ( { restClient } ) => {
    const userData = testData.validUser;
    const response = await restClient.createUser( userData );
    
    expect( response ).toHaveProperty( 'id' );
    expect( response ).toHaveProperty( 'name' );
    expect( response ).toHaveProperty( 'job' );
    expect( response ).toHaveProperty( 'createdAt' );
    
    expect( response.name ).toBe( userData.name );
    expect( response.job ).toBe( userData.job );
    
    expect( response.id ).toBeDefined();
    expect( typeof response.id ).toBe( 'string' );
    expect( response.id.length ).toBeGreaterThan( 0 );
    
    expect( response.createdAt ).toBeDefined();
    expect( new Date( response.createdAt ).getTime() ).toBeGreaterThan( 0 );
    
    const createdTime = new Date( response.createdAt ).getTime();
    const currentTime = Date.now();
    const oneMinute = 60 * 1000;
    expect( createdTime ).toBeGreaterThan( currentTime - oneMinute );
    expect( createdTime ).toBeLessThanOrEqual( currentTime + oneMinute );
  } );

  test( 'REST-06 | Create user with special characters in data', async ( { restClient } ) => {
    const userData = testData.specialCharUser;
    
    const response = await restClient.createUser(userData);
    
    expect( response.name ).toBe(userData.name);
    expect( response.job ).toBe(userData.job);
    expect( response.name ).toContain( 'José' );
    expect( response.name ).toContain( 'María' );
  } );

  test( 'REST-07 | Create multiple users with unique data', async ( { restClient } ) => {
    const user1Data = generateUniqueUserData();
    const user2Data = generateUniqueUserData();
    
    const response1 = await restClient.createUser(user1Data);
    const response2 = await restClient.createUser(user2Data);
    
    expect( response1.name ).toBe(user1Data.name);
    expect( response2.name ).toBe(user2Data.name);
    expect( response1.job ).toBe(user1Data.job);
    expect( response2.job ).toBe(user2Data.job);
    
    expect( response1.id ).not.toBe(response2.id);
  } );

  test( 'REST-08 | Validate response status and headers for POST', async ( { restClient, request } ) => {
    const userData = testData.alternativeUser;
    
    const apiResponse = await restClient.makeRequest( 'post', '/users', userData);
    
    expect( apiResponse.status ).toBe(201);
    expect( apiResponse.ok ).toBeTruthy();
    
    expect( apiResponse.headers['content-type'] ).toContain( 'application/json' );
    
    const responseBody = apiResponse.body as any;
    expect( responseBody.name ).toBe(userData.name);
    expect( responseBody.job ).toBe(userData.job);
  } );

  test( 'REST-09 | Handle empty user data', async ( { restClient } ) => {
    const emptyData = testData.emptyUser;
    
    // reqres.in accepts empty data, so we validate it still creates a user
    const response = await restClient.createUser( emptyData );
    
    expect( response ).toHaveProperty( 'id' );
    expect( response ).toHaveProperty( 'createdAt' );
    expect( response.name ).toBe( '' );
    expect( response.job ).toBe( '' );
  } );
} );

test.describe( 'Error Handling and Edge Cases', () => {
  
  test( 'REST-10 | Handle malformed JSON in POST request', async ( { restClient } ) => {
    const malformedData = '{"name": "Test", "job":}'; // Invalid JSON
    
    const response = await restClient.makeRequest( 'post', '/users', malformedData );
    
    expect( response.status ).toBeGreaterThanOrEqual( 400 );
  } );

  test( 'REST-11 | Validate API response time', async ( { restClient } ) => {
    const startTime = Date.now();
    
    await restClient.getUsers();
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    expect( responseTime ).toBeLessThan( 5000 );
  } );
} );