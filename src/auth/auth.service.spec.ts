import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,  // Mock del UserService
          useValue: {
            findUserByEmail: jest.fn(),  // Mock de la función para pruebas
          },
        },
        {
          provide: JwtService,  // Mock del JwtService
          useValue: {
            sign: jest.fn(),  // Mock de la función sign
          },
        },
        PrismaService,  // No necesitas un mock aquí si no lo usas directamente en las pruebas
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate and return a user when credentials are valid', async () => {
    const mockUser = {
      user_id: 1,
      first_name: 'John',
      middle_name: 'A',
      first_surname: 'Doe',
      second_surname: 'Smith',
      email: 'test@example.com',
      phone_number: '123456789',
      birthdate: new Date('1990-01-01'),
      password: await bcrypt.hash('password', 10),
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser);

    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toEqual({ email: mockUser.email, user_id: mockUser.user_id });
  });

  it('should throw an UnauthorizedException if credentials are invalid', async () => {
    const mockUser = {
      user_id: 1,
      first_name: 'John',
      middle_name: 'A',
      first_surname: 'Doe',
      second_surname: 'Smith',
      email: 'test@example.com',
      phone_number: '123456789',
      birthdate: new Date('1990-01-01'),
      password: await bcrypt.hash('password', 10),
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockUser);

    await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow();
  });

  it('should generate a JWT when login is successful', async () => {
    const mockUser = {
      user_id: 1,
      first_name: 'John',
      middle_name: 'A',
      first_surname: 'Doe',
      second_surname: 'Smith',
      email: 'test@example.com',
      phone_number: '123456789',
      birthdate: new Date('1990-01-01'),
      password: await bcrypt.hash('password', 10),
      created_at: new Date(),
      updated_at: new Date(),
    };
    const mockToken = 'mockToken';
    jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

    const result = await service.login({ email: 'test@example.com', password: 'password' });
    expect(result.access_token).toEqual(mockToken);
  });
});
