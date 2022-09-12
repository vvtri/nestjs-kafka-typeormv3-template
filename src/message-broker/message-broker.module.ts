import { Module, DynamicModule } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Kafka, KafkaConfig, ConsumerConfig } from 'kafkajs';
import { subscribeInfo } from 'src/common/decorators/subcribe-to.decorator';
import { Consumer } from './consumer.service';
import { Producer } from './producer.service';

@Module({})
export class MessageBrokerModule {
  static register({
    config,
    consumerConfig,
  }: {
    config: KafkaConfig;
    consumerConfig: ConsumerConfig;
  }): DynamicModule {
    const kafka = new Kafka(config);

    return {
      global: true,
      module: MessageBrokerModule,
      providers: [
        {
          provide: Consumer,
          inject: [ModuleRef],
          useFactory(moduleRef: ModuleRef) {
            return new Consumer(
              subscribeInfo,
              moduleRef,
              kafka,
              consumerConfig,
            );
          },
        },
        {
          provide: Producer,
          useFactory: () => {
            return new Producer(kafka);
          },
        },
      ],
    };
  }
}
