import { Controller, Get, Post, Put, Delete, Param, Body, Req, Query, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';


@Controller('api/notes')
// Protect all routes
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  // Create a new note
  @Post()
  create(@Req() req, @Body(new ValidationPipe()) body: CreateNoteDto) {
    const { title, content, tags, category } = body;
    return this.notesService.create(req.user.userId, title, content, tags, category);
  }

  // Get all notes of the authenticated user
  @Get()
  findAll(@Req() req, @Query('page') page: number, @Query('limit') limit: number) {
    return this.notesService.findAll(req.user.userId, page, limit);
  }

  // Get a specific note by id
  @Get(':id')
  findOne(@Req() req, @Param('id', ValidateObjectIdPipe) id: string) {
    return this.notesService.findOne(req.user.userId, id);
  }

  // Update an existing note
  @Put(':id')
  update(@Req() req, @Param('id', ValidateObjectIdPipe) id: string, @Body(new ValidationPipe()) body: UpdateNoteDto) {
    const { title, content, tags, category } = body;
    return this.notesService.update(req.user.userId, id, title, content, tags, category);
  }

  // Delete a note
  @Delete(':id')
  delete(@Req() req, @Param('id', ValidateObjectIdPipe) id: string) {
    return this.notesService.delete(req.user.userId, id);
  }
}