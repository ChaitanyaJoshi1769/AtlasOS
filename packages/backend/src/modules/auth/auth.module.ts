import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  exports: [JwtModule],
})
export class AuthModule {}
