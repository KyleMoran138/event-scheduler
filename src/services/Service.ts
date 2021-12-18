import IModel from '../models/Model';
import Repo from '../repo/Repo';

export default class Service<T extends IModel> {
  public repo: Repo<T>;
  private static _getDirectCallError = (methodName: string) => `BASE SERVICE METHOD (${methodName}) CALLED, YOU DIDN'T MEAN TO DO THIS!`

  constructor(){
    this.repo = new Repo<T>();
  }

  public create = async ({...args}): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('create'))
  }  
  public get = async ({...args}): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('get'))
  }  
  public update = async ({...args}): Promise<T | null> => {
    throw new Error(Service._getDirectCallError('update'))
  }  
  public delete = async ({...args}): Promise<boolean> => {
    throw new Error(Service._getDirectCallError('delete'))
  }  
  
}