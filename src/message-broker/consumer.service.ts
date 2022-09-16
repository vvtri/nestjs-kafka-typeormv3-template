import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { info } from 'console';
import {
  Kafka,
  KafkaConfig,
  Consumer as KafkaConsumer,
  EachMessagePayload,
  ConsumerSubscribeTopics,
  ConsumerConfig,
} from 'kafkajs';
import {
  SubscribeTo,
  SubscribeInfo,
} from '../common/decorators/subcribe-to.decorator';
import { ConsumerConstructor } from './interfaces/consumer-constructor.interface';

export class Consumer implements OnModuleDestroy, OnModuleInit {
  private consumer: KafkaConsumer;
  private subscribeInfos: Map<string, SubscribeInfo>;
  private moduleRef: ModuleRef;
  private registry: SchemaRegistry;

  constructor({
    subscribeInfos,
    moduleRef,
    registry,
    kafka,
    consumerConfig,
  }: ConsumerConstructor) {
    this.consumer = kafka.consumer(consumerConfig);
    this.subscribeInfos = subscribeInfos;
    this.moduleRef = moduleRef;
    this.registry = registry;
  }

  async onModuleInit() {
    console.log('go on module init consumer');
    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: [...this.subscribeInfos.keys()],
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const subscribeInfo = this.subscribeInfos.get(payload.topic);

        if (this.registry) {
          payload.message.value = await this.registry.decode(
            payload.message.value,
          );
        }

        const context = this.moduleRef.get(subscribeInfo.context, {
          strict: false,
        });
        await this.subscribeInfos.get(payload.topic).handler.call(context, payload);
      },
    });
  }

  async onModuleDestroy() {
    console.log('go on module destroy consumer');
    await this.consumer.disconnect();
  }
}
