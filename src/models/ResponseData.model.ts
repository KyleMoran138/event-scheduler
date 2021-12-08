export default interface IResponseData<T = unknown> {
  status: 'OK' | 'ERROR' | 'UNKNOWN';
  message: string;
  errorMessage: string;
  data: T;
}

export const ResponseData = (responseData: IResponseData): IResponseData => ({
  ...responseData
});