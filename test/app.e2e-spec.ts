import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdNoteId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Replace with a valid test token or mock guard for real test cases
    jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2Y2Yjc2ZWZmNWUyMGU0OWM1MTk0M2EiLCJlbWFpbCI6ImphY2ttYXJjaWFsMTdAZ21haWwuY29tIiwibmFtZSI6IlJlbmllbCBNYXJjaWFsIiwiaWF0IjoxNzQ0MjUxNzYxLCJleHAiOjE3NDQyNTUzNjF9.ziu9WN7xs4gPIVLyKJ0t9wNAr3WHISPEGH47PFaaKFY';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });

  it('POST /api/notes - should create a note with tags and category', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/notes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
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

  it('GET /api/notes/:id - should return a note with tags and category', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdNoteId);
    expect(response.body.tags).toContain('test');
    expect(response.body.category).toBe('Testing');
  });

  it('PUT /api/notes/:id - should update title and category', async () => {
    const response = await request(app.getHttpServer())
      .put(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Updated Note Title',
        category: 'Updated Category',
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Note Title');
    expect(response.body.category).toBe('Updated Category');
  });

  it('GET /api/notes - should include the updated note', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notes')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    const note = response.body.notes.find((n) => n._id === createdNoteId);
    expect(note).toBeDefined();
    expect(note.title).toBe('Updated Note Title');
  });

  it('DELETE /api/notes/:id - should delete the note', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/notes/${createdNoteId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
  });
});
