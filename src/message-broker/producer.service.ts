import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  Kafka,
  KafkaConfig,
  Producer as KafkaProducer,
  ProducerRecord,
} from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { Topic } from './enums/topic.enum';

export class Producer implements OnModuleDestroy, OnModuleInit {
  private producer: KafkaProducer;

  constructor(private kafka: Kafka, private registry: SchemaRegistry) {
    this.producer = kafka.producer();
  }

  async send(topic: Topic, message: any, schemaId: number | null = null) {
    let encodeMessage = message;

    if (schemaId && this.registry) {
      console.log('message :>> ', message);
      encodeMessage = await this.registry.encode(schemaId, message);
    }

    return this.producer.send({
      topic,
      messages: [{ value: encodeMessage }],
    });
  }

  async onModuleInit() {
    console.log('go on module init producer');
    await this.producer.connect();
  }

  async onModuleDestroy() {
    console.log('go on module destroy producer');
    await this.producer.disconnect();
  }
}
