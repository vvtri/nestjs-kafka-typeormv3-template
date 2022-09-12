import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
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
  subscribeInfo,
  SubscribeInfo,
} from '../common/decorators/subcribe-to.decorator';

export class Consumer implements OnModuleDestroy, OnModuleInit {
  private consumer: KafkaConsumer;

  constructor(
    private subscribeInfo: Map<string, SubscribeInfo>,
    private moduleRef: ModuleRef,
    kafka: Kafka,
    consumerConfig: ConsumerConfig,
  ) {
    this.consumer = kafka.consumer(consumerConfig);
  }

  async onModuleInit() {
    console.log('go on module init consumer');
    await this.consumer.connect();

    await this.consumer.subscribe({
      topics: [...this.subscribeInfo.keys()],
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const info = subscribeInfo.get(payload.topic);

        const context = this.moduleRef.get(info.context, { strict: false });
        await subscribeInfo.get(payload.topic).handler.call(context);
      },
    });
  }

  async onModuleDestroy() {
    console.log('go on module destroy consumer');
    await this.consumer.disconnect();
  }
}
