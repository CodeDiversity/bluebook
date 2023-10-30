import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
  }
  async signUp(email: string, password: string){
    // see if email is in use
    const users = await this.usersService.find(email);
    // hash users password
    if(users.length){
      throw new BadRequestException('email in use');
    }

    // create a new user and save it

    // return the user
  }

  signIn(){}

}