import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  tags?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  category?: string;
}