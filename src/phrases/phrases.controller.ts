import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileInterface } from 'src/recording/interfaces/file.interface';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { LooseFirebaseAuthGuard } from '../auth/loose-firebase-auth.guard';
import CreateThemeDto from './dto/create-theme.dto';
import ThemePhrasesResponseDto from './dto/theme-phrases-response.dto';
import PhrasesInterface from './interfaces/phrases.interface';
import { multerOptions } from './multer.config';
import { PhrasesService } from './phrases.service';

@Controller('phrases')
export class PhrasesController {
  constructor(
    private readonly phrasesService: PhrasesService,
  ) { }

  /**
   * On first get, creates empty user
   *
   * @param {*} theme
   * @returns {Promise<PhrasesInterface>}
   * @memberof PhrasesController
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('theme/:theme')
  async getPhrasesByGroup(@Param('theme') theme): Promise<ThemePhrasesResponseDto> {
    const user = AuthService.getLoggedUser();
    return this.phrasesService.getTheme(theme, user);
  }

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Post('theme')
  addPhraseToGroup(
    @Body() payload: any,
    @UploadedFile() file: FileInterface,
  ): Promise<PhrasesInterface> {
    const data = new CreateThemeDto(payload, file.path);
    return this.phrasesService.createTheme(data);
  }

  @UseGuards(LooseFirebaseAuthGuard)
  @Get('random')
  async getRandomTheme(): Promise<{ title: string }> {
    const user = AuthService.getLoggedUser();
    return await this.phrasesService.getRandomTheme(user);
  }

}
