import { SourceType } from './music.model';

export interface User {
  email: string;
  // password: string;
  username?: string;
  authorities: string[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectedService {
  externalService: SourceType;
  expired: boolean;
  displayName: string;
  imgPath: string;
}
