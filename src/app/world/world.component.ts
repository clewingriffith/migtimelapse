
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CaveLoaderService } from '../caveloader.service';
import { CaveSurvey } from '../cavesurvey';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements AfterViewInit {

  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;

  private cube: THREE.Points;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;


  public rotationSpeedX: number = 0.005;
  public rotationSpeedY: number = 0.01;

  @Input()
  public size: number = 20;


  /* STAGE PROPERTIES */
  @Input()
  public cameraZ: number = 40;

  @Input()
  public fieldOfView: number = 70;

  @Input('nearClipping')
  public nearClippingPane: number = 1;

  @Input('farClipping')
  public farClippingPane: number = 100000;


  constructor(private caveloader: CaveLoaderService) {

   }



  /* STAGING, ANIMATION, AND RENDERING */

  /**
   * Animate the cube
   */
  private animateCube() {
    this.controls.update();
    //console.log(this.controls.getAzimuthalAngle())
    //this.cube.rotation.z += this.rotationSpeedX;
    //this.cube.rotation.x = -90;
    ////this.cube.rotation.z += this.rotationSpeedY;
  }


  private createGeometry() {

    this.caveloader.read3dFile().subscribe( fileItems => {
        const survey = new CaveSurvey(fileItems);
        // let texture = new THREE.TextureLoader().load(this.texture);
        var material = new THREE.PointsMaterial( { color: 0xffffff } );

        var geometry = new THREE.BufferGeometry();
        
        var vertices = [];
        
/*        var vertexArray = new Float32Array( [
          -10.0, -10.0,  10.0,
          10.0, -10.0,  10.0,
          10.0,  10.0,  10.0,

          10.0,  10.0,  10.0,
          -10.0,  10.0,  10.0,
          -10.0, -10.0,  10.0
        ] );

*/

        survey.surveyStations.forEach( station => { vertices.push(station.x, station.z, station.y)});

        const vertexArray = new Float32Array(vertices);
        
       // itemSize = 3 because there are 3 values (components) per vertex
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertexArray, 3 ) );
        geometry.computeBoundingSphere();

        const c = geometry.boundingSphere.center;
        //geometry.translate(c.x, c.y, c.z);
        //geometry.scale(0.1, 0.1, 0.1);
        // geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        this.cube = new THREE.Points( geometry, material );

        // Add cube to scene
        this.scene.add(this.cube);
        
        this.camera.position.set(c.x,c.y+3000,c.z);
        this.camera.up.set(0,1,0);
        this.camera.lookAt(c.x,c.y,c.z);
        this.controls.target = new THREE.Vector3(c.x,c.y,c.z);
        //this.controls.maxAzimuthAngle = Math.PI / 4;
        //this.controls.minAzimuthAngle = 0;
       /* this.controls.maxAzimuthAngle=Math.PI;
        this.controls.minAzimuthAngle=Math.PI-1;
        this.controls.maxPolarAngle=Math.PI;
        this.controls.minPolarAngle=0;*/
        this.controls.update();
        this.startRenderingLoop();
    });
  


  }

  /**
   * Create the scene
   */
  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.controls = new OrbitControls( this.camera );
    this.controls.autoRotate=true;
    this.controls.enablePan=false;
    this.controls.enableZoom=true;
    this.controls.autoRotateSpeed=4.0;
    //this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   */
  private startRenderingLoop() {
    /* Renderer */
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: WorldComponent = this;
    (function render() {
      requestAnimationFrame(render);
      
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }



  /* EVENTS */

  /**
   * Update scene after resizing. 
   */
  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }



  /* LIFECYCLE */

  /**
   * We need to wait until template is bound to DOM, as we need the view
   * dimensions to create the scene. We could create the cube in a Init hook,
   * but we would be unable to add it to the scene until now.
   */
  public ngAfterViewInit() {
    this.createScene();
    this.createGeometry();
    //this.startRenderingLoop();
  }
}