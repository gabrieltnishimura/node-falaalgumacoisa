import CreateThemePhraseDto from './create-theme-phrase.dto';

export default class CreateThemeDto {
  title: string;
  cover: string;
  phrases: CreateThemePhraseDto[];

  constructor(data: any, url: string) {
    this.title = data.title;
    this.cover = data.url;
    this.phrases = JSON.parse(data.phrases);
  }
}
