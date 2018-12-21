
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CaveLoaderService } from '../caveloader.service';
import { CaveSurvey } from '../cavesurvey';
import { SurveyStation } from '../cavesurvey';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements AfterViewInit {

  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private survey: CaveSurvey;
  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;

  private legs: THREE.LineSegments;
  private vertices = [];
  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private numLegsToDisplay = 0;

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
    this.numLegsToDisplay+=10;
    this.numLegsToDisplay = Math.min(this.numLegsToDisplay, this.survey.surveyLegs.length);
    var geo = this.legs.geometry as THREE.BufferGeometry;
    geo.setDrawRange(0,this.numLegsToDisplay);
    this.controls.update();
    //console.log(this.controls.getAzimuthalAngle())
    //this.cube.rotation.z += this.rotationSpeedX;
    //this.cube.rotation.x = -90;
    ////this.cube.rotation.z += this.rotationSpeedY;
  }


  private createGeometry() {

    this.caveloader.read3dFile().subscribe( fileItems => {
        this.survey = new CaveSurvey(fileItems);
        // let texture = new THREE.TextureLoader().load(this.texture);
        //var material = new THREE.PointsMaterial( { color: 0xffffff } );
        var material = new THREE.LineBasicMaterial( { 
          color: 0xffffff,
          linewidth: 40
         } );

        var geometry = new THREE.BufferGeometry();
        
        
        
/*        var vertexArray = new Float32Array( [
          -10.0, -10.0,  10.0,
          10.0, -10.0,  10.0,
          10.0,  10.0,  10.0,

          10.0,  10.0,  10.0,
          -10.0,  10.0,  10.0,
          -10.0, -10.0,  10.0
        ] );

*/

        var surveyStations: SurveyStation[];
        //Don't blindly push the stations. Some of them are fixed points with incorrect locations
        surveyStations = Object.values(this.survey.surveyStations) as SurveyStation[];
        surveyStations.forEach( station => { 
          //if(station.flags.includes("UNDERGROUND")) {
            this.vertices.push(station.x, station.z, station.y);
          //}
        });

        

        var legIndices = [];
        this.survey.surveyLegs.forEach( leg => {
          if(leg[0].flags.includes('UNDERGROUND') || leg[1].flags.includes('UNDERGROUND')) { 
            legIndices.push(leg[0].i); legIndices.push(leg[1].i);

          } 
        });

        const vertexArray = new Float32Array(this.vertices);
        
       // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setIndex(legIndices);
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertexArray, 3 ) );
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();

        
        //const c = geometry.boundingSphere.center;
        //console.log(c);

        //test center of non-indexed version
        const nonindexed = geometry.toNonIndexed();
        nonindexed.computeBoundingSphere();
        const c = nonindexed.boundingSphere.center;


        //geometry.translate(c.x, c.y, c.z);
        //geometry.scale(0.1, 0.1, 0.1);
        // geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        
        this.legs = new THREE.LineSegments( nonindexed, material );
        // Add cube to scene
        this.scene.add(this.legs);
        var box = new THREE.BoxHelper(this.legs, new THREE.Color('red'));
        this.scene.add(box);

        this.camera.position.set(c.x,c.y+nonindexed.boundingSphere.radius,c.z);
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