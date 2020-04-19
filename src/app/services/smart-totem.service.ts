import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmartTotemService {

  constructor(private http: HttpClient) { }

  getDevices(){
    return this.http.get('http://localhost:8080/devices');
  }

  createDevice(device) {
    return this.http.post('http://localhost:8080/devices', device);
  }

}
