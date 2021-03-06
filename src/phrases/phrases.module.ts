import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RecordingModule } from '../recording/recording.module';
import { ScoringModule } from '../scoring/scoring.module';
import { PhrasesController } from './phrases.controller';
import { phrasesProviders } from './phrases.providers';
import { PhrasesService } from './phrases.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RecordingModule,
    ScoringModule,
  ],
  controllers: [
    PhrasesController,
  ],
  providers: [
    PhrasesService,
    ...phrasesProviders,
  ],
  exports: [
    PhrasesService,
  ]
})
export class PhrasesModule { }
