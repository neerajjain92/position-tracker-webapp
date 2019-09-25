import {Component, OnInit} from '@angular/core';
import {icon, latLng, Map, marker, Marker, point, tileLayer} from 'leaflet';
import {MapService} from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: Map;
  coordinates: Coordinates[];
  coordinateCounter = 0;
  shouldIncrement = true;
  markers: Marker[] = [];
  edgeCase = false;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {maxZoom: 18})
    ],
    zoom: 15,
    center: latLng(17.4175339, 78.3440757)
  };

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    const newMarker = marker([17.4175339, 78.3440757],
      {
        icon: icon({
          iconSize: [25, 41],
          iconAnchor: [11, 41],
          iconUrl: 'assets/marker-icon.png'
        }),
        title: 'Swiggy'
      }).bindTooltip('Your Food is here', {permanent: false, offset: point({x: 0, y: 0})});
    this.markers.push(newMarker);

    this.loadGeoCoordinates();

  }

  onMapReady(map: Map) {
    this.map = map;
  }

  loadGeoCoordinates() {
    this.mapService.loadGeoCoordinates()
      .subscribe(
        (response) => {
          console.log(response);
          this.coordinates = response['coordinates'];
          this.animateVehicles();
        },
        (error) => {
          console.log(error);
        });
  }

  animateVehicles() {
    setInterval(() => {
      if (this.shouldIncrement) {
        if (this.coordinateCounter === this.coordinates.length) {
          this.shouldIncrement = false;
          this.edgeCase = true;
        } else {
          this.coordinateCounter++;
          this.edgeCase = false;
        }
      } else {
        if (this.coordinateCounter === 0) {
          this.shouldIncrement = true;
          this.edgeCase = true;
        } else {
          this.coordinateCounter--;
          this.edgeCase = false;
        }
      }

      if (!this.edgeCase) {
        console.log('Moving to lat : ', this.coordinates[this.coordinateCounter].latitude,
          ' and lng ', this.coordinates[this.coordinateCounter].longitude);
        this.markers[0].setLatLng(latLng(this.coordinates[this.coordinateCounter].latitude,
          this.coordinates[this.coordinateCounter].longitude));
      }

    }, 70);
  }

}

class Coordinates {
  latitude: number;
  longitude: number;
}
