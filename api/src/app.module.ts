import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GenerateImageModule } from './generate-image/generate-image.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [AuthModule, GenerateImageModule, CountriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
