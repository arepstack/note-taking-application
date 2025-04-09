import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // Check if the error is due to missing token or expired token
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Your session has expired. Please log in again.',
        );
      }

      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token. Please log in again.');
      }

      // Default error message
      throw new UnauthorizedException(
        'You must be logged in to access this resource.',
      );
    }
    return user;
  }
}
