import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {VehiclesComponent} from './vehicles/vehicles.component';
import {MapComponent} from './map/map.component';
import {HeaderComponent} from './header/header.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {HttpClientModule} from '@angular/common/http';
import {MapService} from './map/map.service';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';

const stompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: 'ws://127.0.0.1:8080/updates',

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 5000,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    // console.log(new Date(), msg);
  }
};


@NgModule({
  declarations: [
    AppComponent,
    VehiclesComponent,
    MapComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule.forRoot(),
    HttpClientModule
  ],
  providers: [MapService,
    {
      provide: InjectableRxStompConfig,
      useValue: stompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
