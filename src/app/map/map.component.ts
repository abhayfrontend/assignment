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
dropdownmap=new Map<object, string>(); 
now=Date.now();
selectedItems = [];
dropdownSettings:any={};
copyfiltertrucks;
color:'#ffffff';
trucks={
  'total':[],
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
    this.emptyTrucks();
   let x=[];
    for(var i=0;i<this.selectedItems.length;i++){
      x.push(this.dropdownmap.get(this.selectedItems[i].item_id));
    }
    this.calculateTrucks(x);
    this.filterTrucks(x);
  }
  emptyTrucks(){
    this.trucks={
      'total':[],
      'idle':[],
      'stopped':[],
      'error':[],
      'running':[]
    }
  }
  onDropDownClose(){
    this.emptyTrucks();
    let x=[];
    for(var i=0;i<this.selectedItems.length;i++){
      x.push(this.dropdownmap.get(this.selectedItems[i].item_id));
    }
    this.calculateTrucks(x);
    this.filterTrucks(x);
  }
  onSelectAll(items: any) {
    this.emptyTrucks();
    this.calculateTrucks(this.data);
    this.filterTrucks(this.data);
  }
getData(){
  this.mapService.getMapData().subscribe(res=>{
 let a:any;
 a=res;
this.data=a.data;
this.setGraphData(a.data);
this.calculateTrucks(a.data);
this.filterTrucks(this.data);

  },err=>{});
}
setGraphData(a){
  let x=[];
  for(var i=0;i<a.length;i++){
    x.push({ item_id: a[i].id, item_text: a[i].truckNumber });
    this.dropdownmap.set(a[i].id, a[i]);
  }
  
  this.dropdownList=x;
  this.selectedItems=x;
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
   this.trucks.total.push(a[i]);
  

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
  y.push({ lat: x[i].lastRunningState.lat, lng: x[i].lastRunningState.lng, alpha: 1,icon:x[i].icon });

  }
  this.markers=y;

}
filterTrucks(trucks){


var ts=Date.now()
let x=[];
for(var i=0;i<trucks.length;i++){
 
 if(trucks[i].lastRunningState.truckRunningState==0){
console.log('1')
  
 let iconUrl = {
  
    url:'https://image.flaticon.com/icons/svg/565/565391.svg',
      scaledSize: {
          width: 40,
          height: 40
      }
  }
  trucks[i]['icon']=iconUrl;
 
 }
 if(trucks[i].lastRunningState.truckRunningState==1){
  let iconUrl = {
  
    url:'https://image.flaticon.com/icons/svg/411/411712.svg',
      scaledSize: {
          width: 40,
          height: 40
      }
  }
  
  trucks[i]['icon']=iconUrl;
  
  
 }
 if(trucks[i].lastWaypoint.ignitionOn==true){
  let iconUrl = {
  
    url:'https://www.flaticon.com/premium-icon/icons/svg/2874/2874879.svg',
      scaledSize: {
          width: 40,
          height: 40
      }
  }
 
  trucks[i]['icon']=iconUrl;
 
 }
 if(trucks[i].lastRunningState.stopStartTime<ts-14400000){
  let iconUrl = {
  
    url:'https://t3.ftcdn.net/jpg/01/52/49/90/240_F_152499010_GguXZpoX8iKBnQi2xCFbMaI0cuXVgP0m.jpg',
      scaledSize: {
          width: 40,
          height: 40
      }
  }
  
  trucks[i]['icon']=iconUrl;
  
 }
}
for(var i=0;i<trucks.length;i++){
  console.log(trucks[i].icon)
}
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
