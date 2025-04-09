import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Find the user by email or create them if they don't exist
  async findOrCreate(googleUser: Partial<User>): Promise<User> {
    // Check if the user already exists based on their email
    const existingUser = await this.userModel.findOne({
      email: googleUser.email,
    });

    if (existingUser) {
      return existingUser;
    }

    // If the user doesn't exist, create a new one and save it
    const newUser = new this.userModel(googleUser);
    return newUser.save();
  }
}
