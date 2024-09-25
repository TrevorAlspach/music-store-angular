import { SourceType } from './music.model';

export interface User {
  email: string;
  password: string;
  username?: string;
}

export interface ConnectedService {
  externalService: string;
  imgPath: string;
}
