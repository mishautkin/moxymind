import { APIRequestContext } from '@playwright/test';
import { 
  ListUsersResponse, 
  CreateUserRequest, 
  CreateUserResponse, 
  SingleUserResponse 
} from '../resources/types';

export class RestClient {
  private request: APIRequestContext;
  private baseURL: string = String( process.env.BASE_URL_RESTAPI );
  private apiKey: string = String( process.env.RESTAPI_KEY );

  constructor( { request }: { request: APIRequestContext } ) {
    this.request = request;
  }

  /**
   * Request method with authorization
   */
  async makeRequest( method: 'get' | 'post' | 'put' | 'delete', endpoint: string, data?: any ) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    };

    const response = await this.request[ method ]( `${ this.baseURL }${ endpoint }`, {
      headers,
      data,
    } );
    
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: response.ok() ? await response.json() : await response.text(),
      ok: response.ok(),
    };
  }

  /**
   * Get list of users with pagination
   * @param page - Page number (optional)
   * @param perPage - Items per page (optional)
   * @returns Promise<ListUsersResponse>
   */
  async getUsers( page?: number, perPage?: number ): Promise< ListUsersResponse > {
    const params = new URLSearchParams();
    if ( page ) { params.append( 'page', page.toString() ); }
    if ( perPage ) { params.append( 'per_page', perPage.toString() ); }
    
    const queryString = params.toString() ? `?${ params.toString() }` : '';
    
    const response = await this.makeRequest( 'get', `/users${ queryString }` );
    
    if ( ! response.ok ) {
      throw new Error( `GET /users failed with status ${ response.status }: ${ response.statusText }` );
    }
    
    return response.body as ListUsersResponse;
  }

  /**
   * Get single user by ID
   * @param userId - User ID
   * @returns Promise<SingleUserResponse>
   */
  async getUserById( userId: number ): Promise< SingleUserResponse > {
    const response = await this.makeRequest( 'get', `/users/${ userId }` );
    
    if ( ! response.ok ) {
      throw new Error( `GET /users/${ userId } failed with status ${ response.status }: ${ response.statusText }`);
    }
    
    return response.body as SingleUserResponse;
  }

  /**
   * Create a new user
   * @param userData - User creation data
   * @returns Promise<CreateUserResponse>
   */
  async createUser( userData: CreateUserRequest ): Promise< CreateUserResponse > {
    const response = await this.makeRequest( 'post', '/users', userData);
    
    if ( ! response.ok ) {
      throw new Error( `POST /users failed with status ${ response.status }: ${ response.statusText }` );
    }
    
    return response.body as CreateUserResponse;
  }
}