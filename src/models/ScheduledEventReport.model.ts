import IModel from './Model';

export default interface IScheduledEventReport extends IModel {
  success: boolean;
};

export const ScheduledEventReport = (scheduledEventReportData: IScheduledEventReport) => ({
  ...scheduledEventReportData
})