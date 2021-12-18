import IModel from './Model';

export default interface IClient extends IModel {
  name: string;
  email: string;
  disabled: boolean;
  keys: {name: string, value: string}[];
}

export const Client = (clientData: IClient) => ({
  ...clientData,
})