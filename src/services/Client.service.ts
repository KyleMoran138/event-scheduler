import { Service } from '../services/Service';
import { Client, ClientSchema, ClientSchemaName } from '../models/Client.model'
import { CLIENT_EXISTS } from '../Exceptions';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


class ClientService extends Service<Client>{

  constructor(){
    super(ClientSchemaName, ClientSchema);
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

  // create method to log into client account with email and password
  public loginClient = async (email: string, password: string): Promise<string | null> => {
    const auth = getAuth();
    try{
      const firebaseUser = await signInWithEmailAndPassword(auth, email, password);
      return firebaseUser.user.uid;
    }catch(e){
      return null;
    }
  }

};

export {
  ClientService,
}