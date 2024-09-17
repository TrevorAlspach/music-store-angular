import { Injectable } from '@angular/core';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  constructor() { }

  public parse(file: File, config: Papa.ParseLocalConfig<any, File>):void {
    Papa.parse<any>(file, config);
  }

  public unparse(json: any, config?: Papa.UnparseConfig): string{
    if (config){
      return Papa.unparse<any>(json, config);
    } else {
      return Papa.unparse<any>(json);
    }
  }
}
