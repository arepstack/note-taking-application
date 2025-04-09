import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  // Create a new note
  async create(userId: string, title: string, content: string, tags?: string[], category?: string) {
    try {
      return this.noteModel.create({
        user: userId,
        title,
        content,
        tags: tags || [],
        category: category || 'general',
      });
    } catch (error) {
      throw new Error('Error creating note: ' + error.message);
    }
  }

  // Retrieve all notes of the logged-in user
  async findAll(userId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [notes, total] = await Promise.all([
        this.noteModel.find({ user: userId }).skip(skip).limit(limit),
        this.noteModel.countDocuments({ user: userId }),
      ]);

      return {
        notes,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
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
  async update(userId: string, id: string, title?: string, content?: string, tags?: string[], category?: string) {
    const note = await this.findOne(userId, id);
    if (note.user.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this note');
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (category) note.category = category;
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
