import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      // signUp: () => { },
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
    };
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'abc@gmail.com',
          password: '123',
        } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{
          id: 1,
          email: email,
          password: '123',
        }] as User[])
      }
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findUser returns the user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn({ email: 'abc@gmail.com', password: '123' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('sets session to null on signOut', async () => {
    const session = { userId: 1 };
    await controller.signOut(session);
    expect(session.userId).toEqual(null);
  });
});
