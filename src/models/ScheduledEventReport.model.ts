export default interface IScheduledEventReport {
  _id: string
};

export const ScheduledEventReport = (scheduledEventReportData: IScheduledEventReport) => ({
  ...scheduledEventReportData
})