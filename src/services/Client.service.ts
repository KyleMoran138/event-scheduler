import { Service } from '../services/Service';
import { Client, ClientSchema, ClientSchemaName } from '../models/Client.model'
import { CLIENT_EXISTS, CLIENT_ID_NOT_FOUND } from '../Exceptions';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { signInWithEmailAndPassword, Auth } from "firebase/auth";


class ClientService extends Service<Client>{

  private firebaseAppAuth: Auth;

  constructor(appAuth: Auth){
    super(ClientSchemaName, ClientSchema);
    this.firebaseAppAuth = appAuth;
  }

  /**
   * Creates new client.
   * 
   * 1) Does a search for a record with a matching email and username.
   * 2) If find record is null, returns null.
   * 3) If find record exists, throws client exists error if client found.
   * 4) Returns result of this.create.
   * 
   * @param name: name of client
   * @param email: email of client
   * @param disabled?: is disabled
   * @throws CLIENT_EXISTS
   * @returns Client | null
   */
  public createClient = async (name: string, email: string, password: string, disabled= false): Promise<Client | null> => {
    const matchingClient = await this._repo.find([], {name, email, disabled: false});
    if(matchingClient === null){
      return null;
    }

    if(matchingClient.length){
      throw CLIENT_EXISTS();
    }

    const auth = getAdminAuth();
    try{
      const firebaseUser = await auth.createUser({email, password});
      return await this.create({
        name,
        email,
        disabled,
        firebaseUid: firebaseUser.uid,
      });
    }catch(e){
      throw CLIENT_EXISTS();
    }
  }
  
  public loginClient = async (email: string, password: string): Promise<Client | null> => {
    try{
      const firebaseUser = await signInWithEmailAndPassword(this.firebaseAppAuth, email, password);
      const clients = await this._repo.find([], {firebaseUid: firebaseUser.user.uid});
    
      if(clients === null || clients.length === 0){
        return null;
      }

      const client = clients[0];
      client.token = await firebaseUser.user.getIdToken();

      return client;
    }catch(e){
      return null;
    }
  }

};

export {
  ClientService,
}