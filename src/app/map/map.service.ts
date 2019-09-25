import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class MapService {

  constructor(private http: HttpClient) {
  }

  loadGeoCoordinates() {
    return this.http.get("assets/coordinates.json");
  }
}
