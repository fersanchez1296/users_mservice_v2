import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisPublisher implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({ url: 'redis://redis:6379' });
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
    await this.client.connect();
    console.log('🔗 Redis conectado (Publisher)');
  }

  async publish(channel: string, message: any) {
    if (!this.client.isOpen) await this.client.connect();
    const payload = JSON.stringify(message);
    await this.client.publish(channel, payload);
    console.log(`📤 Mensaje publicado en ${channel}:`, payload);
  }
}
