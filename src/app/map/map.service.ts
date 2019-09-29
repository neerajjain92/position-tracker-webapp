import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {BehaviorSubject} from 'rxjs';
import {Vehicle} from '../vehicles/vehicle';

@Injectable()
export class MapService {

  subscription: BehaviorSubject<Vehicle>;

  constructor(private http: HttpClient, private rxStompService: RxStompService) {
    this.subscribeToLiveUpdatesOfVehicles();
    this.subscription = new BehaviorSubject(null);
  }

  subscribeToLiveUpdatesOfVehicles() {
    this.rxStompService.watch('/chat')
      .subscribe((message: Message) => {
        const body = JSON.parse(message.body);
        const vehicle = new Vehicle(
          body.name,
          Number(body.lat),
          Number(body.lng),
          body.timestamp,
          Number(body.speed)
        );
        // Updating New Vehicle.
        this.subscription.next(vehicle);
      }, (error => {
        console.log('Error in listening to live updates on websocket ==> ', error);
      }));
  }

  loadGeoCoordinates() {
    return this.http.get('assets/coordinates.json');
  }
}
