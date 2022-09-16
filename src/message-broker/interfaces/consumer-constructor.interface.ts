import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { ModuleRef } from '@nestjs/core';
import { Kafka, ConsumerConfig } from 'kafkajs';
import { SubscribeInfo } from 'src/common/decorators/subcribe-to.decorator';

export interface ConsumerConstructor {
  subscribeInfos: Map<string, SubscribeInfo>;
  moduleRef: ModuleRef;
  registry: SchemaRegistry | null;
  kafka: Kafka;
  consumerConfig: ConsumerConfig;
}
