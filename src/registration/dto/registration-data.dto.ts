import { IsNotEmpty } from 'class-validator';

export default class RegistrationDataDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  gender: 'F' | 'M' | 'O';
  @IsNotEmpty()
  age: string;
  @IsNotEmpty()
  region: string;
  @IsNotEmpty()
  dialect: string;
}
