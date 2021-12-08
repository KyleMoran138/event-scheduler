export default interface IClient {
  _id: string;
  name: string;
  email: string;
  disabled: boolean;
  keys: {name: string, value: string}[];
}

export const Client = (clientData: IClient) => ({
  ...clientData,
})