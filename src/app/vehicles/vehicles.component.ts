import { Component, OnInit } from '@angular/core';
import {Vehicle} from './vehicle';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  vehicles: Vehicle[];
  focusedVehicle: string;

  constructor() { }

  ngOnInit() {
  }

  focusVehicle(vehicle: Vehicle) {

  }

}
