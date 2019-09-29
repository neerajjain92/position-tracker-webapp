import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {BehaviorSubject} from 'rxjs';
import {Vehicle} from '../vehicles/vehicle';
import {LatLng} from '../vehicles/LatLng';

@Injectable()
export class MapService {

  subscription: BehaviorSubject<Vehicle>;
  focusedVehicle: BehaviorSubject<Vehicle>;
  focusedVehicleHistory: BehaviorSubject<LatLng []>;

  constructor(private http: HttpClient, private rxStompService: RxStompService) {
    this.subscribeToLiveUpdatesOfVehicles();
    this.subscription = new BehaviorSubject(null);
    this.focusedVehicle = new BehaviorSubject(null);
    this.focusedVehicleHistory = new BehaviorSubject(null);
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

  updateFocusedVehicle(vehicle: Vehicle) {
    this.focusedVehicle.next(vehicle);

    if (vehicle === null) {
      this.focusedVehicleHistory.next(null);
    } else {
      this.http
        .get<LatLng[]>('http://' + window.location.hostname + ':' + window.location.port + '/api/vehicles/history/' + vehicle.name)
        // .get<LatLng[]>('http://192.168.99.104:30030/vehicles/history/' + vehicle.name)
        .subscribe(data => this.focusedVehicleHistory.next(data));
    }
  }
}
