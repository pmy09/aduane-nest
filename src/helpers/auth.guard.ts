// Import required dependencies and modules
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Define a constant to be used as a metadata key
export const IS_PUBLIC_KEY = 'isPublic';

// Define a decorator to mark routes as public
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  // Implement the canActivate method required by the CanActivate interface
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // If the route is public, allow access
      return true;
    }

    // Extract the request object from the context
    const request = context.switchToHttp().getRequest();
    // Extract the token from the request headers
    const token = this.extractTokenFromHeader(request);

    // If no token is found, throw an UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verify the token using the JwtService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET, // Use the secret stored in the environment variable
      });
      // Assign the payload to the request object so that it can be accessed in route handlers
      request['user'] = payload;
    } catch {
      // If the token is invalid or verification fails, throw an UnauthorizedException
      throw new UnauthorizedException();
    }

    // If the token is valid, allow access to the route
    return true;
  }

  // Extract the token from the Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
