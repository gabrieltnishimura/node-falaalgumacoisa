import { IsNotEmpty } from 'class-validator';
import CreateThemePhraseDto from './create-theme-phrase.dto';

export default class CreateThemeDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  cover: string;
  @IsNotEmpty()
  suggested: boolean;
  @IsNotEmpty()
  phrases: CreateThemePhraseDto[];
}
