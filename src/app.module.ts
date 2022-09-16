import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from 'datasource';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageBrokerModule } from './message-broker/message-broker.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MessageBrokerModule.register({
      kafkaConfig: {
        clientId: 'my-app',
        brokers: ['pkc-ldvr1.asia-southeast1.gcp.confluent.cloud:9092'],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: 'IEBSLAREOAZ7VXRE',
          password:
            'T8li8qQzp/SqlviKE2ZHosKTs2qU4oRWy9dEarz+S7l0Lj4knWAFQrIN5PEsP+f9',
        },
      },
      consumerConfig: { groupId: 'test', allowAutoTopicCreation: false },
      schemaRegistry: {
        config: {
          host: 'https://psrc-zy38d.ap-southeast-1.aws.confluent.cloud',
          auth: {
            username: 'W2RLJAFPJQXNBTLU',
            password:
              'G3Tq42Hl7JgiHSZne2+TPft08U5T5B0uJsmyEJ6tXDI83oyQZZF9pFaji4xo4SAc',
          },
        },
        schemaId: 10002,
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({}),
      dataSourceFactory: async () => datasource,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
