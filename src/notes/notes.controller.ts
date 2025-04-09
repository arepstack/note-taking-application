import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';

@Controller('api/notes')
// Protect all routes
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  // Create a new note
  @Post()
  create(@Req() req, @Body(new ValidationPipe()) body: CreateNoteDto) {
    return this.notesService.create(req.user.userId, body.title, body.content);
  }

  // Get all notes of the authenticated user
  @Get()
  findAll(@Req() req) {
    return this.notesService.findAll(req.user.userId);
  }

  // Get a specific note by id
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.notesService.findOne(req.user.userId, id);
  }

  // Update an existing note
  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body(new ValidationPipe()) body: UpdateNoteDto) {
    return this.notesService.update(req.user.userId, id, body.title, body.content);
  }

  // Delete a note
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.notesService.delete(req.user.userId, id);
  }
}