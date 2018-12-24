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


  public readDEMData(): Observable<ArrayBuffer> {
    //This parses a .asc.bin as preprocessed by a python script in this project
    //processAscDem.py
    //input data to that script is a .asc file from http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso&culture=en-US
    return this.http.get('assets/GK1_404_123.asc.1m.bin', {responseType: 'arraybuffer'});
    
  }


/*
  //deprecated because it seems to truncate the file, and the file is unnecessarily massive. 

  public readDEMDataAscii(): Observable<number[]> {
    //This parses a .asc file from http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso&culture=en-US

    return this.http.get('assets/GK1_404_123.asc', {responseType: 'text'}).pipe(map( data => {
        var points = [];
        (data as string).trim().split('\n').forEach( line => {
            var p = line.split(';');
            points.push(parseFloat(p[0]), parseFloat(p[2]), parseFloat(p[1]));
        });
        return points;
      }
    ));
    
  }
*/


}
