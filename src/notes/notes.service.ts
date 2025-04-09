import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  // Create a new note
  async create(userId: string, title: string, content: string) {
    try {
      const note = await this.noteModel.create({ user: userId, title, content });
      return note;
    } catch (error) {
      throw new Error('Error creating note: ' + error.message);
    }
  }

  // Retrieve all notes of the logged-in user
  async findAll(userId: string) {
    try {
      return this.noteModel.find({ user: userId });
    } catch (error) {
      throw new Error('Error fetching notes: ' + error.message);
    }
  }

  // Retrieve a specific note and check ownership
  async findOne(userId: string, id: string) {
    const note = await this.noteModel.findById(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  // Update an existing note and check ownership
  async update(userId: string, id: string, title: string, content: string) {
    const note = await this.findOne(userId, id);
    if (note.user.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this note');
    }
    note.title = title;
    note.content = content;
    return note.save();
  }

  // Delete a note and check ownership
  async delete(userId: string, id: string) {
    const note = await this.findOne(userId, id);
    if (note.user.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this note');
    }
    return note.deleteOne();
  }
}
