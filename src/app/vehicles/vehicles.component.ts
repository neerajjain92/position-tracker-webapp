import {Component, OnInit} from '@angular/core';
import {Vehicle} from './vehicle';
import {MapService} from '../map/map.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  vehicles: Vehicle[] = [];
  focusedVehicle: string;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.mapService.subscription.subscribe(updatedVehicle => {
      if (updatedVehicle == null) {
        return;
      }
      const vehicleIndexInDictionary = this.vehicles
        .findIndex(existingVehicle => existingVehicle.name === updatedVehicle.name);

      if (vehicleIndexInDictionary === -1) { // Update coming for the first time for this vehicle.
        this.vehicles.push(updatedVehicle);
        this.vehicles.sort((a: Vehicle, b: Vehicle) => {
          return a.name > b.name ? 1 : -1;
        });
      } else {
        this.vehicles[vehicleIndexInDictionary] = updatedVehicle;
      }

    });
  }

  focusVehicle(vehicle: Vehicle) {

  }

}
