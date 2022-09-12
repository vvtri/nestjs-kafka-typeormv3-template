import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, KafkaConfig, Producer as KafkaProducer } from 'kafkajs';

export class Producer implements OnModuleDestroy, OnModuleInit {
  private producer: KafkaProducer;

  constructor(private kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async send() {}

  async onModuleInit() {
    console.log('go on module init producer');
    await this.producer.connect();
  }

  async onModuleDestroy() {
    console.log('go on module destroy producer');
    await this.producer.disconnect();
  }
}
