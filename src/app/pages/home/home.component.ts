import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Device } from 'src/app/models/device';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SmartTotemService } from 'src/app/services/smart-totem.service';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  deviceForm: FormGroup;
  devices: Device[];
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;



  constructor(private ngxSpimner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private smartService: SmartTotemService) { }

  ngOnInit(): void {
    this.ngxSpimner.show();
    this.deviceForm = this.formBuilder.group({
      name: '',
      latitude: '',
      longitude: '',
      region: '',
      currentCO2: 0,
      currentTemperature: 0,
      currentHumidity: 0,
    });
    this.devices = [];
    this.smartService.getDevices().subscribe((devices: Device[]) => {
      this.devices = devices;
      this.devices.forEach(device => {
        if (device.latitude && device.longitude) {
          const newMarker = new google.maps.Marker({
            position: new google.maps.LatLng(device.latitude, device.longitude),
            map: this.map,
            
          });
          newMarker.addListener('click', () => {
            this.map.setZoom(16);
            this.map.setCenter(newMarker.getPosition());
          });
        }
      });
      this.ngxSpimner.hide();
    }, () => {
      this.ngxSpimner.hide();
    });

  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    let coordinates = new google.maps.LatLng(-23.501837, -47.453512);

    let mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 14,
    };
    this.map = new google.maps.Map(this.gmap.nativeElement,
      mapOptions);
      this.map.addListener('click', (localClicked) => {
        this.deviceForm.get('latitude').setValue(localClicked.latLng.lat());
        this.deviceForm.get('longitude').setValue(localClicked.latLng.lng());
      });
  }

  createDevice() {
    let device = { ...this.deviceForm.value, region: { name: this.deviceForm.value.region } };
    this.ngxSpimner.show();
    this.smartService.createDevice(device).subscribe((response: Device) => {
      this.devices.push(response);
      const newMarker = new google.maps.Marker({
        position: new google.maps.LatLng(response.latitude, response.longitude),
        map: this.map,
        
      });
      newMarker.addListener('click', () => {
        this.map.setZoom(16);
        this.map.setCenter(newMarker.getPosition());
      });
      this.deviceForm.reset();
      this.ngxSpimner.hide();
    },
      (err) => {
        this.ngxSpimner.hide();
        console.log(err)
      })

  }


}
