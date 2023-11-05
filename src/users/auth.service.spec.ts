import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // create a fake copy of the users service
    let users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve(users.filter(user => user.email === email));
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };
    const module = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService,

      }],
    }).compile();

    service = module.get(AuthService);
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('abc@gmail.com', '123456');
    expect(user.password).not.toEqual('123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('test@gmail.com', '123456');
    await expect(service.signUp('test@gmail.com', '123456')).rejects.toThrow(BadRequestException);
  });

  it('throws if signIn is called with an unused email', async () => {
    await expect(
      service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('123nb@gmail.com', '123456');
    await expect(
      service.signIn('laskdjf@alskdfj.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('abc@gmail.com', '123456');
    const user = await service.signIn('abc@gmail.com', '123456');
    expect(user).toBeDefined();
  })

  it('returns a user if correct password is provided alternate', async () => {
    await service.signUp('abc@gmail.com', '123456');
    const user = await service.signIn('abc@gmail.com', '123456');
    expect(user).toBeDefined();
  })
});


