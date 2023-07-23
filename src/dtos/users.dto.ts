import { IsString, IsNotEmpty, MinLength, MaxLength,  IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password!: string;

  @IsString()
  @IsNotEmpty()
  public phone!: string;
}

export class NewPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password!: string;

  @IsString()
  @IsNotEmpty()
  public token!: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password!: string;
}
