import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { AccessControlModule } from '../common/shared/access-control.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    AccessControlModule,
    UsersModule,
  ],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
