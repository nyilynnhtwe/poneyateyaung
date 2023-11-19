import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GenerateImageModule } from './generate-image/generate-image.module';
import { CountriesModule } from './countries/countries.module';
import { AdminDashBoardModule } from './admin-dashboard/admin-dashboard.module';
import { ExpressAdapter } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule,
    GenerateImageModule,
    CountriesModule,
    AdminDashBoardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: ExpressAdapter,
      useValue: new ExpressAdapter(),
    },
  ],
})
export class AppModule {
  constructor(private readonly expressAdapter: ExpressAdapter) {
    // Enable trust proxy
    this.expressAdapter.getInstance().set('trust proxy', 1);
  }
}
