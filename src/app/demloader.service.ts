import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable,of, from } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DEMLoaderService {



  constructor( private http: HttpClient) {

  }


  public readDEMData(tile: string, resolution: number): Observable<ArrayBuffer> {
    //This parses a .asc.bin as preprocessed by a python script in this project
    //processAscDem.py
    //input data to that script is a .asc file from http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso&culture=en-US
    return this.http.get('assets/dem/GK1_' + tile + '.asc.' + resolution + 'm.bin', {responseType: 'arraybuffer'});
    
  }


}
