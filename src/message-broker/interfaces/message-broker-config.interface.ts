import { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api';
import { KafkaConfig, ConsumerConfig } from 'kafkajs';

export interface MessageBrokerConfig {
  kafkaConfig: KafkaConfig;
  consumerConfig: ConsumerConfig;
  schemaRegistry?: {
    config: SchemaRegistryAPIClientArgs;
    schemaId: number
  };
}
