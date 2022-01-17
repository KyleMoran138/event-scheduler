import { Schema } from 'mongoose';
import { IModel } from '../models/Model';

interface ScheduledEventReport extends IModel {
  success: boolean;
};

const ScheduledEventReportSchemaName = 'ScheduledEventReport';
const ScheduledEventReportSchema = new Schema<ScheduledEventReport>({
  success: {
    type: Boolean,
    required: true,
  },
});

export {
  ScheduledEventReport,
  ScheduledEventReportSchemaName,
  ScheduledEventReportSchema,
}