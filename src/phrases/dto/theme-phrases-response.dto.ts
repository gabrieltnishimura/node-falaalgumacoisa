import ThemePhrasesItemResponseDto from './theme-phrases-item-response.dto';
import { ThemePhrasesModalEventResponseDto } from './theme-phrases-modal-event-response.dto';

export default interface ThemePhrasesResponseDto {
  themeId: string;
  title: string;
  cover: string;
  stepsCap: number;
  skippedSteps: number;
  total: number;
  phrases: ThemePhrasesItemResponseDto[];
  modalEvents: ThemePhrasesModalEventResponseDto[];
}
