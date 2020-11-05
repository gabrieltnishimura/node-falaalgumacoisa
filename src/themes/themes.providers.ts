import { Connection, Model } from 'mongoose';
import { UserRecording } from './interfaces/user-recording.interface';
import { UserRecordingSchema } from './schemas/user-recording.schema';


export const themesProviders = [
  {
    provide: 'THEMES_MODEL',
    useFactory: (connection: Connection): Model<UserRecording> => connection.model('UserRecording', UserRecordingSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];
