import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  providers: [UserService],  // Asegúrate de que está aquí en providers
  controllers: [UsersController],
  exports: [UserService],  // Y exportado correctamente aquí
})
export class UserModule {}
