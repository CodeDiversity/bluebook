import {IsEmail, IsString, IsOptional} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsEmail()
  @IsOptional()
  password?: string;
}
