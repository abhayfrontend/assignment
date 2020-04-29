import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NiceDateFormatPipePipe } from './pipes/nice-date-format-pipe.pipe';
@NgModule({
  declarations: [
    AppComponent,
    
    MapComponent,
    
    NiceDateFormatPipePipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCzo7T82dIhxSxFdBIWlTHfmYk_InsdZqA'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
