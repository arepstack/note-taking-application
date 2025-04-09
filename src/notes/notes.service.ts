import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  // Create a new note
  async create(userId: string, title: string, content: string) {
    return this.noteModel.create({ user: userId, title, content });
  }

  // Retrieve all notes of the logged-in user
  async findAll(userId: string) {
    return this.noteModel.find({ user: userId });
  }

  // Retrieve a specific note and check ownership
  async findOne(userId: string, id: string) {
    const note = await this.noteModel.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    // Check if the user owns the note
    if (note.user.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this note');
    }

    return note;
  }

  // Update an existing note and check ownership
  async update(userId: string, id: string, title: string, content: string) {
    const note = await this.findOne(userId, id);
    note.title = title;
    note.content = content;
    return note.save();
  }

  // Delete a note and check ownership
  async delete(userId: string, id: string) {
    const note = await this.findOne(userId, id);
    return this.noteModel.findByIdAndDelete(id);
  }
}
