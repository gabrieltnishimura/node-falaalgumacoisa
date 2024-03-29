import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import AuthUserModel from '../auth/auth-user.model';
import UserRecordingTheme from './interfaces/user-recording-theme.interface';
import {
  UserRecording,
  UserRecordingBase,
} from './interfaces/user-recording.interface';
import toHours from './utils/toHours';

@Injectable()
export class UserRecordingService {
  constructor(
    @Inject('USER_RECORDING_MODEL')
    private userRecordingModel: Model<UserRecording>,
  ) {}

  public async getOrCreateUser(user: AuthUserModel): Promise<UserRecording> {
    const dbUser = await this.getUser(user);
    if (dbUser) {
      return dbUser;
    }

    const emptyUser = this.getEmptyUser(user.uid);
    return this.userRecordingModel.create(emptyUser);
  }

  private getEmptyUser(firebaseId: string): UserRecordingBase {
    return {
      user: {
        firebaseId,
        referralCode: this.getRandomReferralCode(),
      },
      themes: [],
      notifications: [],
    };
  }

  private getRandomReferralCode(): string {
    const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(16)
      .join()
      .split(',')
      .map(function() {
        return s.charAt(Math.floor(Math.random() * s.length));
      })
      .join('');
  }

  public async getUser(user: AuthUserModel): Promise<UserRecording | null> {
    return await this.userRecordingModel
      .findOne({ 'user.firebaseId': user.uid })
      .exec();
  }

  public async getUserRecordingTheme(
    themeId: string,
    loggedUser: AuthUserModel,
  ): Promise<UserRecordingTheme | null> {
    const user = await this.userRecordingModel
      .findOne({ 'user.firebaseId': loggedUser.uid })
      .exec();
    return this.filterRecordingTheme(themeId, user);
  }

  public async getUserByNickname(
    nickname: string,
  ): Promise<UserRecording | null> {
    return await this.userRecordingModel
      .findOne({ 'user.nickname': nickname })
      .exec();
  }

  public async getUserByReferralCode(
    code: string,
  ): Promise<UserRecording | null> {
    return await this.userRecordingModel
      .findOne({ 'user.referralCode': code })
      .exec();
  }

  public filterRecordingTheme(
    themeId: string,
    user: UserRecording,
  ): UserRecordingTheme | null {
    return user ? user.themes.find(each => each.themeId === themeId) : null;
  }

  public async mergeUsers(
    oldUserUid: string,
    loggedUser: AuthUserModel,
  ): Promise<void> {
    if (!oldUserUid || !loggedUser) {
      return;
    }

    const newUser = await this.getUser(loggedUser);
    // should only migrate anon users
    const oldUser = await this.userRecordingModel
      .findOne({ 'user.firebaseId': oldUserUid })
      .exec();

    if (!newUser) {
      // first time login
      const migratedUser = this.getEmptyUser(loggedUser.uid);
      if (oldUser) {
        // if old user available, migrate data
        migratedUser.user = oldUser.user;
        migratedUser.themes = oldUser.themes;
        migratedUser.user.firebaseId = loggedUser.uid;
        await oldUser.remove();
      } // if not, just create a empty user
      await this.userRecordingModel.create(migratedUser);
    } else {
    } // second time login -- user exists, no need to migrate
  }

  public count(): Promise<number> {
    return this.userRecordingModel.countDocuments().exec();
  }

  public async getHoursRecorded(): Promise<number> {
    const response = await this.userRecordingModel
      .aggregate([
        {
          $unwind: {
            path: '$themes',
          },
        },
        {
          $unwind: {
            path: '$themes.recordings',
          },
        },
        {
          $group: {
            _id: null,
            sum: {
              $sum: '$themes.recordings.duration',
            },
          },
        },
      ])
      .exec();

    const durationMs = response?.[0]?.sum;
    return toHours(durationMs) || 0;
  }
}
