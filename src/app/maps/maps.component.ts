import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {

  @ViewChild('map')mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  center: any = {
    lat: 16.4002647,
    lng: 81.9068124,
  }
  
  markerId: string;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
  }

  async createMap() {
    try{
    this.newMap = await GoogleMap.create({
      id: 'capacitor-google-maps',
      element: this.mapRef.nativeElement,
      apiKey: environment.google_maps_api_key,
      config: {
        center: this.center, 
        zoom: 2,
      },
    });

    this.addMarker(this.center.lat,this.center.lng);
    this.addListeners();
  }catch(e){
    console.log(e);
  }

  }
  
  async addMarker(lat,lng){
    // if(this.markerId) this.removeMarker();
    this.markerId = await this.newMap.addMarker({
      coordinate:{
        lat: lat,
        lng: lng,
      },

      draggable: true
    })
  }
  
   async removeMarker(id?) {
    await this.newMap.removeMarker(id ? id :this.markerId);
   }

   async addListeners(){
    await this.newMap.setOnMarkerClickListener((event)=>{
      console.log('setOnMarkerClickListener',event);
      this.removeMarker(event.markerId);
    });

    await this.newMap.setOnMapClickListener((event)=>{
      console.log('setOnMapClickListener',event);
      this.addMarker(event.latitude, event.longitude);
    });

    await this.newMap.setOnMyLocationButtonClickListener((event) => {
     console.log('setOnMyLocationButtonClickListener',event);
    //  this.addMarker(event.latitude, event.longitude);
    });
  
    await this.newMap.setOnMyLocationClickListener((event)=>{
      console.log('setOnMyLocationClickListener',event);
      this.addMarker(event.latitude, event.longitude);
    });
   }
}
