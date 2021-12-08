export default class Repo<T> {

  protected directCallError = (methodName: string) => `REPO CLASS METHOD (${methodName}) DIRECTLY CALLED, YOU DID NOT MEAN TO DO THIS`;

  public createRecord = async (newData: Partial<T>): Promise<T | null> => {
    throw new Error(this.directCallError('createRecord'));
  }

  public getRecord = async (_id: string): Promise<T | null> => {
    throw new Error(this.directCallError('getRecord'));
  }

  public getAllRecords = async (): Promise<T[] | null> => {
    throw new Error(this.directCallError('getAllRecords'));
  }

  public updateRecord = async (_id: string, newData: Partial<T>): Promise<T | null> => {
    throw new Error(this.directCallError('updateRecord'));
  }

  public deleteRecord = async (_id: string): Promise<boolean> => {
    throw new Error(this.directCallError('deleteRecord'));
  }

}