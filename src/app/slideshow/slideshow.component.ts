import { Component, OnInit, Input, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { WorldComponent } from '../world/world.component';
import anime  from 'animejs';
import { GlobalViewParameters } from '../GlobalViewParameters';
import { RGBA_PVRTC_2BPPV1_Format, Vector3 } from 'three';
import * as THREE from 'three';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {

  private timeline: any;

  @ViewChild(WorldComponent, { static: true })
  private world: WorldComponent;

  private viewParams:GlobalViewParameters;

  @Input('titletext')
  private titletext = "my text";
  private subtext = "sub text";

  constructor() { }

  ngOnInit() {
   /*   anime({
    targets: 'p',
    translateX: 250,
    rotate: '1turn',
    backgroundColor: '#FFF',
    duration: 800
    });*/
  }

  ngAfterViewInit() {
    let world = this.world;
    this.viewParams = this.world.viewParameters;

    this.timeline = anime.timeline();

  
    var h1Opacities = [ { value: '0', duration: 0}, 
                 { value: '1', easing: 'linear', duration: 1000},
                 { value: '1', easing: 'linear', duration: 10000},
                 { value: '0', easing: 'linear', duration: 1000}];
    var h2Opacities = [ { value: '0', duration: 0}, 
                 { value: '1', easing: 'linear', duration: 1000},
                 { value: '1', easing: 'linear', duration: 9000},
                 { value: '0', easing: 'linear', duration: 1000}];

    var slideshow = this;

    


    // Add children 
    this.timeline

    .add({
      targets: 'h1',
      duration: 2000,
      color: [ { value: '#000', duration: 0}, { value: '#fff', easing: 'linear'} ],
      begin: function(anim) {
        slideshow.titletext = 'Votla Gora | The Hollow Mountain';
      },
      complete: function(anim) {
        console.log('h1 complete');
      }
      //color: [ { value: '#000', duration: 0}, { value: '#fff', easing: 'linear'} ]
    })
    .add({
      targets: 'h2',
      duration: 3000,
      color: [ { value: '#000', duration: 0}, { value: '#fff', easing: 'linear'} ],
      begin: function(anim) {
        slideshow.subtext = 'The caves of Tolminski Migovec';
      }
    }
    )
    .add({
      targets: this.viewParams,
      //altitudeAngle: Math.PI/4,
      altitudeAngle: 0,
      azimuthAngle: 0,
      cameraDistance: [10000,1500],
      duration: 500,
      easing: "easeOutCubic",
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })
    .add({
      targets: this.viewParams,
      terrainOpacity: 1,
      altitudeAngle: [0,Math.PI/2-0.6],
      duration: 5000,
      easing: "easeOutCubic",
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })
    .add({
      targets: this.viewParams,
      terrainOpacity: [1.0,1.0],
      azimuthAngle: 2*Math.PI,
      duration: 5000,
      easing: "easeInOutCubic",
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })
    .add({
      targets: this.viewParams,
      //zmax: [ 1900, 1500 ] ,
      cameraDistance: 500,
      azimuthAngle: 0,
      //altitudeAngle: Math.PI/2+0.1,
      duration: 20000,
      easing: 'linear',
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })
    .add({
      targets: this.viewParams,
      cameraDistance: 260,
      azimuthAngle: 0.4,
      altitudeAngle: Math.PI/2-0.2,
      duration: 5000,
      easing: 'linear',
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })
    .add({
      targets: this.viewParams,
      showYear: [1994, 2018],
      duration: 80000,
      loop: 4,
      easing: 'linear',
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })
    /*.add({
      targets: this.viewParams,
      azimuthAngle: [0,2*Math.PI],
      altitudeAngle: Math.PI/2,
      duration: 5000,
      easing: "linear",
      update: function() {
        world.updateFromViewParams()
        world.renderFrame();
      }
    })*/

    /*.add({
      targets: '#slideZoomin>h1',
      opacity: h1Opacities,
    },5000)
    .add({
      targets: '#slideZoomin>h2',
      opacity: h2Opacities,
    },'-=11000')    
    .add({
      targets: '#slide1974>h1',
      opacity: h1Opacities,
    },'+=100')
    .add({
      targets: '#slide1974>h2',
      opacity: h2Opacities,
    },'-=11000')
    .add({
      targets: '#slide1978>h1',
      opacity: h1Opacities,
    },'+=100')
    .add({
      targets: '#slide1978>h2',
      opacity: h2Opacities,
    },'-=11000')*/
   /* .add({
      targets: '#slide1978>h1',
      opacity: [ { value: '0', duration: 0}, 
                 { value: '1', easing: 'linear', duration: 1000},
                 { value: '1', easing: 'linear', duration: 10000},
                 { value: '0', easing: 'linear', duration: 1000}]
    })
    .add({
      targets: '#slide1978>h2',
      opacity: [ { value: '0', duration: 0}, 
                 { value: '1', easing: 'linear', duration: 1000},
                 { value: '1', easing: 'linear', duration: 9000},
                 { value: '0', easing: 'linear', duration: 1000}]
    },16000)*/
  /*  .add({
      delay: 3000,
      duration: 1000,
      targets: '#slide2>h1',
      color: [ { value: '#000'}, { value: '#fff', easing: 'linear'} ],
      begin: function(anim) {
        slideshow.titletext = '1974';
      }
    })
    .add({
      targets: 'h2',
      delay: 4000,
      duration: 1000,
      color: [ { value: '#000'}, { value: '#fff', easing: 'linear'} ],
      begin: function(anim) {
        slideshow.subtext = 'Initial Exploration';
      }
    })
    .add({
      targets: world,
      delay: 10000,
      duration: 10000,
      azimuth: 2*Math.PI,
      numLegsToDisplay: 5000,
      easing: 'linear',
      loop: true
    });*/
  }

  
  @HostListener('window:keydown', ['$event']) onKey(event: KeyboardEvent) {
    console.log(event);
    switch(event.code) {
      case 'ArrowLeft': 
        this.viewParams.azimuthAngle += 0.1; break;
      case 'ArrowRight':
        this.viewParams.azimuthAngle -= 0.1; break;
      case 'ArrowUp':
        this.viewParams.altitudeAngle -= 0.1; break;
      case 'ArrowDown':
        this.viewParams.altitudeAngle += 0.1; break;   
      case 'PageUp':
        this.viewParams.cameraDistance -= 10; break;
      case 'PageDown':
        this.viewParams.cameraDistance += 10; break;   
      case 'KeyW':
        this.viewParams.terrainWireframe = !this.viewParams.terrainWireframe; break;   
      case 'Digit1':
        this.viewParams.terrainResolution = 100; break;
      case 'Digit2':
        this.viewParams.terrainResolution = 10; break;
      case 'Digit3':
        this.viewParams.terrainResolution = 1; break;
      case 'KeyT':
          if(this.viewParams.terrainOpacity == 0.3) {
            this.viewParams.terrainOpacity = 1;
          } else {
            this.viewParams.terrainOpacity = 0.3;
          }
          break;
      case 'KeyC':
        this.viewParams.showCave = !this.viewParams.showCave; break;
      case 'Numpad8':
        this.viewParams.caveOffset.y += 10; break;
      case 'Numpad2':
          this.viewParams.caveOffset.y -= 10; break;
      case 'Numpad4':
        this.viewParams.caveOffset.x -= 10; break;
      case 'Numpad6':
        this.viewParams.caveOffset.x += 10; break;
      
    }
    this.world.updateFromViewParams()
    this.world.renderFrame();
  }

}
