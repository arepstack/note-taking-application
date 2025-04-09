import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  @Get()
  findAll(@Req() req) {
    console.log('Authenticated user:', req.user);
    return `Get notes for user: ${req.user.email}`;
  }

  @Post()
  createNote(@Req() req, @Body() body) {
    return {
      message: `Note created for ${req.user.email}`,
      note: body,
    };
  }
}
