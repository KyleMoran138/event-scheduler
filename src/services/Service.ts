import { FilterQuery, Schema } from 'mongoose';
import { IModel } from '../models/Model';
import { Repo, DocumentType } from '../repo/Repo';

export class Service<T extends IModel> {
  protected _repo: Repo<T>;

  constructor(modelName: string, schema?: Schema<T>){
    this._repo = new Repo<T>(modelName, schema);
  }

  public async create(newData: Partial<T>): Promise<T | null> {
    const result = await (this._repo.createRecord(newData));

    if(!result){
      return null;
    }

    return result;
  };

  public async get(_id: string, populate?: string[]): Promise<T | null>{ 
    const result = await this._repo.getRecord(_id, populate);

    if(!result){
      return null;
    }
    
    return result;
  };

  public async getAll(populate?: string[]): Promise<T[] | null>{ 
    const results = await this._repo.getAllRecords(populate);

    if(!results){
      return null;
    }
    
    return results;
  };

  public async update(_id: string, newData: Partial<T>): Promise<T | null>{ 
    const result = await this._repo.updateRecord(_id, newData);

    if(!result){
      return null;
    }
    
    return result;
  };

  public async delete(_id: string): Promise<boolean>{ 
    return await this._repo.deleteRecord(_id) ;
  };

  public async find(filter: FilterQuery<T>, populate?: string[]): Promise<T[] | null>{ 
    const result = await this._repo.find(populate || [], filter);

    if(!result){
      return null;
    }
    
    return result;
  };

}