import { Module } from '@nestjs/common';
import { ReelsService } from './reels.service';

@Module({
  providers: [ReelsService],
  exports: [ReelsService],
})
export class ReelsModule {}
