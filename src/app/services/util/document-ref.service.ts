import { Injectable } from '@angular/core';

export interface CustomDocument extends Document {
  MusicKit: any;
}

function getDocument(): any {
  return document;
}

@Injectable()
export class DocumentRefService {
  get customDocument(): CustomDocument {
    return getDocument();
  }
}
