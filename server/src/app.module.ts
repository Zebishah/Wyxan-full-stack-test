import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { SitesModule } from './sites/sites.module';
import { PeopleModule } from './people/people.module';
import { VisitsModule } from './visits/visits.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') ?? 'mongodb://127.0.0.1:27017/small-web'
      })
    }),
    SitesModule,
    PeopleModule,
    VisitsModule,
    SearchModule
  ]
})
export class AppModule {}
