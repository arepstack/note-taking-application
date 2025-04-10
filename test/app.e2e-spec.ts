import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  let regularUserJwtToken: string;
  let adminJwtToken: string;
  let createdNoteId: string;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    configService = app.get(ConfigService);

    regularUserJwtToken = configService.get<string>('REGULAR_USER_TOKEN');
    adminJwtToken = configService.get<string>('ADMIN_TOKEN');

    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });

  // Reusable function for creating and testing notes
  const createNote = async (token: string, noteData: any) => {
    return request(app.getHttpServer())
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(noteData);
  };

  const getNote = async (token: string, noteId: string) => {
    return request(app.getHttpServer())
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
  };

  const updateNote = async (token: string, noteId: string, updatedData: any) => {
    return request(app.getHttpServer())
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
  };

  const deleteNote = async (token: string, noteId: string) => {
    return request(app.getHttpServer())
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
  };

  // Regular User Test Cases
  it('REGULAR_USER POST /api/notes - should create a note with tags and category', async () => {
    const response = await createNote(regularUserJwtToken, {
      title: 'Test Note with Tags',
      content: 'This note has tags and a category.',
      tags: ['test', 'e2e'],
      category: 'Testing',
    });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Note with Tags');
    expect(response.body.tags).toContain('test');
    expect(response.body.category).toBe('Testing');
    createdNoteId = response.body._id;
  });

  it('REGULAR_USER GET /api/notes/:id - should return a note with tags and category', async () => {
    const response = await getNote(regularUserJwtToken, createdNoteId);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdNoteId);
    expect(response.body.tags).toContain('test');
    expect(response.body.category).toBe('Testing');
  });

  it('REGULAR_USER PUT /api/notes/:id - should update title and category', async () => {
    const response = await updateNote(regularUserJwtToken, createdNoteId, {
      title: 'Updated Note Title',
      category: 'Updated Category',
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Note Title');
    expect(response.body.category).toBe('Updated Category');
  });

  it('REGULAR_USER GET /api/notes - should include the updated note', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${regularUserJwtToken}`);

    expect(response.status).toBe(200);
    const note = response.body.notes.find((n) => n._id === createdNoteId);
    expect(note).toBeDefined();
    expect(note.title).toBe('Updated Note Title');
  });

  it('REGULAR_USER DELETE /api/notes/:id - should NOT delete the note', async () => {
    const response = await deleteNote(regularUserJwtToken, createdNoteId);

    expect(response.status).toBe(403);
  });

  // Admin Test Cases
  it('ADMIN POST /api/notes - should create a note with tags and category', async () => {
    const response = await createNote(adminJwtToken, {
      title: 'Test Note with Tags',
      content: 'This note has tags and a category.',
      tags: ['test', 'e2e'],
      category: 'Testing',
    });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Note with Tags');
    expect(response.body.tags).toContain('test');
    expect(response.body.category).toBe('Testing');
    createdNoteId = response.body._id;
  });

  it('ADMIN GET /api/notes/:id - should return a note with tags and category', async () => {
    const response = await getNote(adminJwtToken, createdNoteId);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdNoteId);
    expect(response.body.tags).toContain('test');
    expect(response.body.category).toBe('Testing');
  });

  it('ADMIN PUT /api/notes/:id - should update title and category', async () => {
    const response = await updateNote(adminJwtToken, createdNoteId, {
      title: 'Updated Note Title',
      category: 'Updated Category',
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Note Title');
    expect(response.body.category).toBe('Updated Category');
  });

  it('ADMIN GET /api/notes - should include the updated note', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${adminJwtToken}`);

    expect(response.status).toBe(200);
    const note = response.body.notes.find((n) => n._id === createdNoteId);
    expect(note).toBeDefined();
    expect(note.title).toBe('Updated Note Title');
  });

  it('ADMIN DELETE /api/notes/:id - should delete the note', async () => {
    const response = await deleteNote(adminJwtToken, createdNoteId);

    expect(response.status).toBe(200);
  });
});
