import Repo from '../repo/Repo';

export default class Service<T> {
  public repo: Repo<T>;
  private static _getDirectCallError = (methodName: string) => `BASE SERVICE METHOD (${methodName}) CALLED, YOU DIDN'T MEAN TO DO THIS!`

  constructor(){
    this.repo = new Repo<T>();
  }

  public create = async (): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('create'))
  }  
  public get = async (): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('get'))
  }  
  public update = async (): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('update'))
  }  
  public delete = async (): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('delete'))
  }  
  
}