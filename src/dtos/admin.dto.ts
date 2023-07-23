import { IsString, IsNotEmpty, MinLength, MaxLength, validate } from 'class-validator';

export class AdminCreateUserDto {
    public email: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(32)
    public password: string;
  
    public phone: string;

    public role: string;

    public adminVerified: boolean;

    public emailVerified: boolean;

    public phoneVerified: boolean;

    public active : boolean;

    public twoFactorEnabled: boolean;
  
    validate() {
      if (!this.email && !this.phone) throw new Error('Please provide email or phone');
      if (this.email && this.phone) throw new Error('Please provide only email or phone');
  
      // check if the email is valid
      if (this.email) {
        if (!this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) throw new Error('Please provide a valid email');
      }
  
      // check if the phone is valid
      if (this.phone) {
        if (!this.phone.match(/^[0-9]{10,11}$/)) throw new Error('Please provide a valid phone');
      }
  
      return validate(this);
    }
  }

  export class AdminUpdateSettingDto {
    @IsNotEmpty()
    public value: string;
  }