import { Component, OnInit } from '@angular/core';
import {MapService} from '../map.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
data:any;
dropdownList=[];
now=Date.now();
selectedItems = [];
dropdownSettings:any={};
copyfiltertrucks;
trucks={
  'idle':[],
  'stopped':[],
  'error':[],
  'running':[]
}
lat = 43.879078;
lng = -103.4615581;
filteredTrucks:any;
selectedMarker;
markers = [
  // These are all just random coordinates from https://www.random.org/geographic-coordinates/

];


  constructor(private mapService:MapService) { }

  ngOnInit() {
 
    this.selectedItems = [
     
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getData();
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
getData(){
  this.mapService.getMapData().subscribe(res=>{
 let a:any;
 a=res;
this.data=a.data;
this.calculateTrucks(a.data);
this.filterTrucks(this.data);

  },err=>{});
}

calculateTrucks(a){
  var ts=Date.now()
  let x=[];
 for(var i=0;i<a.length;i++){
   if(a[i].lastRunningState.truckRunningState==0){
    this.trucks.stopped.push(a[i]);
   }
   if(a[i].lastRunningState.truckRunningState==1){
    this.trucks.running.push(a[i]);
    
   }
   if(a[i].lastWaypoint.ignitionOn==true){
    this.trucks.idle.push(a[i]);
   }
   if(a[i].lastRunningState.stopStartTime<ts-14400000){
    this.trucks.error.push(a[i]);
   }
  
     x.push({ item_id: a[i].id, item_text: a[i].truckNumber });
   
this.dropdownList=x;
 }

}
addMarker(lat: number, lng: number) {
  this.markers.push({ lat, lng, alpha: 0.4 });
}

max(coordType: 'lat' | 'lng'): number {
  return Math.max(...this.markers.map(marker => marker[coordType]));
}

min(coordType: 'lat' | 'lng'): number {
  return Math.min(...this.markers.map(marker => marker[coordType]));
}

selectMarker(event) {
  this.selectedMarker = {
    lat: event.latitude,
    lng: event.longitude
  };
}
calculateMarker(x){
  let y=[];
  for(var i=0;i<x.length;i++){
  y.push({ lat: x[i].lastRunningState.lat, lng: x[i].lastRunningState.lng, alpha: 1 });

  }
  this.markers=y;
}
filterTrucks(trucks){
  debugger;
this.filteredTrucks=trucks;
this.copyfiltertrucks=this.filteredTrucks;
this.calculateMarker(this.filteredTrucks);
}
filterItem(value) {
    

 
  if (!value) {
    this.filteredTrucks=this.copyfiltertrucks;
  } // when nothing has typed
  this.filteredTrucks= Object.assign([], this.copyfiltertrucks).filter(
    item => item.truckNumber.toLowerCase().indexOf(value.toLowerCase()) > -1,
  );
}
}
