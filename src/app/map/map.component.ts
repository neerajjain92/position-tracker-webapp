import {Component, OnInit} from '@angular/core';
import {icon, latLng, Map, marker, Marker, point, polyline, tileLayer} from 'leaflet';
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
  focusedVehicle: string;
  focusedVehicleHistory;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {maxZoom: 18})
    ],
    zoom: 15,
    center: latLng(26.9124, 75.7873)
  };

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.mapService.subscription.subscribe(vehicle => {
      if (vehicle === null) {
        return;
      }

      const existingEntryInMarkers = this.markers.findIndex(existingMarker => existingMarker.options.title === vehicle.name);

      if (existingEntryInMarkers === -1) {
        const newMarker = marker([vehicle.lat, vehicle.lng],
          {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [11, 41],
              iconUrl: 'assets/marker-icon.png'
            }),
            title: vehicle.name
          }).bindTooltip(vehicle.name, {permanent: true, offset: point({x: 0, y: 0})});
        this.markers.push(newMarker);
      } else {
        this.markers[existingEntryInMarkers].setLatLng(latLng(vehicle.lat, vehicle.lng));
      }
    });

    // Fly to the Focused Vehicle
    this.mapService.focusedVehicle.subscribe(vehicle => {
      if (vehicle === null) {
        this.focusedVehicle = null;
        return;
      } else {
        this.focusedVehicle = vehicle.name;
        this.map.flyTo([vehicle.lat, vehicle.lng],
          this.map.getZoom(), {
            animate: true
          });
      }
    });

    // Show History for a Focused Vehicle
    this.mapService.focusedVehicleHistory.subscribe(newHistory => {
      if (newHistory === null) {
        return;
      }
      if (this.focusedVehicleHistory) {
        this.focusedVehicleHistory.remove(this.map);
      }

      const LatLng = [];
      newHistory.forEach(history => {
        const coordinate = [];
        coordinate.push(history.lat);
        coordinate.push(history.lng);
        LatLng.push(coordinate);
      });

      this.focusedVehicleHistory = polyline(LatLng, {weight: 10, opacity: 0.5, color: 'red'});
      this.focusedVehicleHistory.addTo(this.map);
    });

    // this.loadGeoCoordinates();
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  loadGeoCoordinates() {
    this.mapService.loadGeoCoordinates()
      .subscribe(
        (response) => {
          // console.log(response);
          this.coordinates = response['coordinates'];
          // this.animateVehicles();
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
        // console.log('Moving to lat : ', this.coordinates[this.coordinateCounter].latitude,
        //   ' and lng ', this.coordinates[this.coordinateCounter].longitude);
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
