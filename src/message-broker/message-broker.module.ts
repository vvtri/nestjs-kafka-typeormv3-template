import { Module, DynamicModule } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Kafka, KafkaConfig, ConsumerConfig } from 'kafkajs';
import { subscribeInfos } from 'src/common/decorators/subcribe-to.decorator';
import { Consumer } from './consumer.service';
import { Producer } from './producer.service';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { MessageBrokerConfig } from 'src/message-broker/interfaces/message-broker-config.interface';

@Module({})
export class MessageBrokerModule {
  static async register({
    kafkaConfig,
    consumerConfig,
    schemaRegistry,
  }: MessageBrokerConfig): Promise<DynamicModule> {
    const kafka = new Kafka(kafkaConfig);
    let registry = null;

    if (schemaRegistry) {
      registry = new SchemaRegistry(schemaRegistry.config);
    }

    return {
      global: true,
      module: MessageBrokerModule,
      providers: [
        {
          provide: Consumer,
          inject: [ModuleRef],
          useFactory(moduleRef: ModuleRef) {
            return new Consumer({
              subscribeInfos,
              moduleRef,
              kafka,
              consumerConfig,
              registry,
            });
          },
        },
        {
          provide: Producer,
          useFactory: () => {
            return new Producer(kafka, registry);
          },
        },
      ],
      exports: [Consumer, Producer],
    };
  }
}
