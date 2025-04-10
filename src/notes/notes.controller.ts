import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Notes') // Group all the routes under the 'Notes' section
@ApiBearerAuth() // Enable JWT authentication
@Controller('api/notes')
// Protect all routes
@UseGuards(JwtAuthGuard, RoleGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  // Create a new note
  @Post()
  @Roles(Role.REGULAR_USER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  create(@Req() req, @Body(new ValidationPipe()) body: CreateNoteDto) {
    const { title, content, tags, category } = body;
    return this.notesService.create(req.user.userId, title, content, tags, category);
  }

  // Get all notes of the authenticated user
  @Get()
  @Roles(Role.REGULAR_USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all notes for the authenticated user' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'List of notes' })
  findAll(@Req() req, @Query('page') page: number, @Query('limit') limit: number) {
    return this.notesService.findAll(req.user.userId, page, limit);
  }

  // Get a specific note by id
  @Get(':id')
  @Roles(Role.REGULAR_USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get a specific note by ID' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note found' })
  findOne(@Req() req, @Param('id', ValidateObjectIdPipe) id: string) {
    return this.notesService.findOne(req.user.userId, id);
  }

  // Update an existing note
  @Put(':id')
  @Roles(Role.REGULAR_USER, Role.ADMIN)
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({ status: 200, description: 'Note updated' })
  update(@Req() req, @Param('id', ValidateObjectIdPipe) id: string, @Body(new ValidationPipe()) body: UpdateNoteDto) {
    const { title, content, tags, category } = body;
    return this.notesService.update(req.user.userId, id, title, content, tags, category);
  }

  // Delete a note
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a note (Admin only)' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note deleted' })
  delete(@Req() req, @Param('id', ValidateObjectIdPipe) id: string) {
    return this.notesService.delete(req.user.userId, id);
  }
}
