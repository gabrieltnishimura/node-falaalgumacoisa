export default interface DashboardResponseActionDto {
  id: string;
  type: 'REGISTER' | 'RECORDING' | 'EXTRA';
  points: number;
  isRecording: boolean;
  background: {
    src: string;
    alt: string;
  }
  banner?: {
    title: string,
    src: string,
    alt: string,
  }
}