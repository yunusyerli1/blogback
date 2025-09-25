import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { typeOrmConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { appConfigSchema } from './config/config.types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    load: [appConfig, typeOrmConfig, authConfig],
    validationSchema: appConfigSchema,
    validationOptions: { 
     // allowUnknown: true, 
      abortEarly: true 
    },
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) =>  ({
        ...configService.get('database'),
        entities: []
      })
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: TypedConfigService,
    useExisting: ConfigService
  }],
})
export class AppModule {}
