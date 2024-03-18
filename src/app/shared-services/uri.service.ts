import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UriService {

  public BASE_URL = baseUrl;

  constructor() { }
}
