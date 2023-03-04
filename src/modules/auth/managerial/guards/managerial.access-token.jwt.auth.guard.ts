import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ManagerialAccessTokenJwtAuthGuard extends AuthGuard(
  'managerial-access-token-jwt',
) {

    
}
