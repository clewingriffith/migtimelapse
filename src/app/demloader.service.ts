import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable,of, from } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DEMLoaderService {

  //prefix: string = "assets/dem/GK1_";
  prefix: string = "assets/dem/96TM/TM1_";

  constructor( private http: HttpClient) {

  }

/*
  public readDEMData(tile: string, resolution: number): Observable<ArrayBuffer> {
    //This parses a .asc.bin as preprocessed by a python script in this project
    //processAscDem.py
    //input data to that script is a .asc file from http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso&culture=en-US
    return this.http.get(this.prefix + tile + '.' + resolution + 'm.bin', {responseType: 'arraybuffer'});
    
  }
*/
  public readDEMHeightData(tile: string, resolution: number): Observable<ArrayBuffer> {
    //This parses a .height.bin as preprocessed by a python script in this project
    //processAscDem.py
    //input data to that script is a .asc file from http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso&culture=en-US
    return this.http.get(this.prefix + tile + '.' + resolution + 'm.height.bin', {responseType: 'arraybuffer'});
    
  }

}
