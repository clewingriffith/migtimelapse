
import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild /*, HostListener*/ } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CaveLoaderService } from '../caveloader.service';
import { DEMLoaderService } from '../demloader.service';
import { CaveSurvey } from '../cavesurvey';
import { SurveyStation } from '../cavesurvey';
import { GlobalViewParameters } from '../GlobalViewParameters';


export type TerrainMode = 'wireframe' | 'texture' | 'none';


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
  
  public viewParameters: GlobalViewParameters = new GlobalViewParameters();

  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;

  private legs: THREE.LineSegments;
  private vertices = [];
  private renderer: THREE.WebGLRenderer;

  private demPointCloud: THREE.Points;

  private demMeshMaterial: THREE.MeshLambertMaterial;

  private demMeshMaterials: THREE.MeshLambertMaterial[] = [];

  private _terrainMode: TerrainMode;
  private scene: THREE.Scene;
  private group: THREE.Object3D;
  private terrainObject: THREE.Object3D;
  private _numLegsToDisplay = 0;

  public rotationSpeedX: number = 0.005;
  public rotationSpeedY: number = 0.01;

  //private animating = true;

  @Input()
  public size: number = 20;


  @Input()
  set terrainMode(mode:TerrainMode) {
    this._terrainMode = mode; 
    if(mode === 'wireframe') {
      this.demMeshMaterial.wireframe = true;
    } else {
      this.demMeshMaterial.wireframe = false;
    }
  }

  @Input('numSurveyLegsToDisplay')
  set numLegsToDisplay(n: number) {
    //console.log(n);
    if(n>0) {
      this._numLegsToDisplay = Math.ceil(n);
    }
  }

  get numLegsToDisplay() {
    return this._numLegsToDisplay;
  }

  @Output('maxDisplayDate')
  get maxDisplayDate() {
    if(this.survey && this.survey.legsByDate && this._numLegsToDisplay>0) {
      let legAtN = this.survey.legsByDate[this._numLegsToDisplay];
      return legAtN.date;
    } else {
      return 0;
    }
    
  }

  /* STAGE PROPERTIES */
  @Input()
  public cameraZ: number = 40;

  @Input()
  public fieldOfView: number = 70;

  @Input('nearClipping')
  public nearClippingPane: number = 1;

  @Input('farClipping')
  public farClippingPane: number = 100000;
/*
  @HostListener('window:keydown', ['$event']) onKey(event: KeyboardEvent) {
    console.log(event);
    if(event.code === "Space") {
      this.controls.autoRotate = !this.controls.autoRotate; //this.animating = !this.animating;
    }
    if(event.code === "KeyD") {
      this.terrainObject.visible = !this.terrainObject.visible;
    }
  }*/

  constructor(private caveloader: CaveLoaderService, private demloader: DEMLoaderService) {

   }


  public updateFromViewParams() {


    //clamp
    if(this.viewParameters.azimuthAngle < 0) {
      this.viewParameters.azimuthAngle += 2*Math.PI;
    }
    if(this.viewParameters.azimuthAngle > 2*Math.PI) {
      this.viewParameters.azimuthAngle -= 2*Math.PI;
    }
    if(this.viewParameters.altitudeAngle < 0.01) {
      this.viewParameters.altitudeAngle = 0.01;
    }
    if(this.viewParameters.altitudeAngle > Math.PI/2) {
      this.viewParameters.altitudeAngle = Math.PI/2;
    }

    //This lot came from when we used orbit controls.
    ////////////
     let currentAzimuth = this.controls.getAzimuthalAngle();
     let currentAltitude = this.controls.getPolarAngle();
     //console.log('current azimuth' + this.azimuth);
     this.controls.rotateLeft(currentAzimuth - this.viewParameters.azimuthAngle);
     this.controls.rotateUp(currentAltitude - this.viewParameters.altitudeAngle);
     //this.controls.rotateLeft(this.azimuth);
    
     //this.controls.update();
    /////////////

    //controlling the camera directly
    this.camera.position.copy(this.viewParameters.getCameraCartesianPosition());
    this.camera.lookAt(this.viewParameters.targetPosition);
    //it appears that this.demMeshMaterial is only one of the terrain segments: it probably 
    //shouldn't be a class variable.
    this.demMeshMaterials.forEach(m => m.opacity = this.viewParameters.terrainOpacity);
    this.demMeshMaterials.forEach(m => m.wireframe = this.viewParameters.terrainWireframe);
    //this.demMeshMaterial.opacity = this.viewParameters.terrainOpacity;
  }

   public renderFrame() {
     this.renderer.render(this.scene, this.camera);
   }

  /* STAGING, ANIMATION, AND RENDERING */

  /**
   * Animate the cave survey, drawing progressively more survey legs
   */
  public animateSurvey() {
    /*this.numLegsToDisplay+=1;
    this.numLegsToDisplay = Math.min(this.numLegsToDisplay, this.survey.legsByDate.length);
    var geo = this.legs.geometry as THREE.BufferGeometry;
    geo.setDrawRange(0,this.numLegsToDisplay);
    this.controls.update();*/
    //console.log(this.controls.getAzimuthalAngle())
  }


  // pass a tile name like 404_123
  // This reads the dem data for the tile and creates geometry for it.
  // it also loads appropriate texture information
  // resolution should be 1 for 1m resolution, 10 for 10m resolution, 100 for 100m resolution
  private createMountainPointcloud(tile: string, resolution: number) {
    this.demloader.readDEMData(tile, resolution).subscribe( arraybuffer => {
      const geometry = new THREE.BufferGeometry();
      //const geometry = new THREE.PlaneBufferGeometry(1000,1000,99,99);
      const demPointArray = new Float32Array(arraybuffer);

      var texture = new THREE.TextureLoader().load( 'assets/satellite/' + tile + '.jpg' );
      const grid_width = 1+(1000/resolution);
      //build out indices for mesh version
      var indices = [];
      var uvs = [];
      var normals = [];
      var ix; 
      var iy;
      const gridX = grid_width - 1;
	    const gridY = grid_width - 1;

	    const gridX1 = gridX + 1;
	    const gridY1 = gridY + 1;
      for ( iy=0; iy<gridY; iy++ ) {
        for ( ix=0; ix<gridX; ix++ ) {
          var a = ix + gridX1  * iy;
          var b = ix + gridX1  * ( iy + 1 );
          var c = ( ix + 1 ) + gridX1  * ( iy + 1 );
          var d = ( ix + 1 ) + gridX1  * iy;

          // faces
          indices.push( a, b, d );
          indices.push( b, c, d );

        }
      }
      
var segment_width = 1000 / gridX;
	var segment_height = 1000 / gridY;
var width_half = 500;
	var height_half = 500;
      for ( iy = 0; iy < gridY1; iy ++ ) {
		    var y = iy * segment_height - height_half;
  		  for ( ix = 0; ix < gridX1; ix ++ ) {
	    		var x = ix * segment_width - width_half;

			    
			    uvs.push(  ( iy / gridY ) );
uvs.push( ix / gridX );
  		  }

	    }

      //indices.push(0,1,100);
      
      geometry.setIndex(indices);
      geometry.addAttribute( 'position', new THREE.BufferAttribute( demPointArray, 3 ) );
      geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
      geometry.computeVertexNormals();
      var demMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
      this.demMeshMaterial = new THREE.MeshLambertMaterial( { color: 0xcccccc, map: texture, transparent:true, wireframe: false } );
      
      this.demMeshMaterials.push(this.demMeshMaterial);


      var mesh = new THREE.Mesh( geometry, this.demMeshMaterial );
      this.terrainObject = new THREE.Object3D;
      this.terrainObject.add(mesh);


      //Keep out of the scene until we want to display
      this.group.add(this.terrainObject);
      
      var demPointCloud = new THREE.Points(geometry, demMaterial);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      
      //this.scene.add(demPointCloud);
  //    //this.demPointCloud = new THREE.Points( geometry, demMaterial );
      //this.group.add(mesh);





    });
  }
  
  private createGeometry() {

    this.caveloader.read3dFile().subscribe( fileItems => {
        this.survey = new CaveSurvey(fileItems);
        // let texture = new THREE.TextureLoader().load(this.texture);
        //var material = new THREE.PointsMaterial( { color: 0xffffff } );
        var material = new THREE.LineBasicMaterial( { 
          color: 0xffffff
         } );

        var geometry = new THREE.BufferGeometry();
        

        var surveyStations: SurveyStation[];
        //Don't blindly push the stations. Some of them are fixed points with incorrect locations
        surveyStations = Object.values(this.survey.surveyStations) as SurveyStation[];
        surveyStations.forEach( station => { 
          //if(station.flags.includes("UNDERGROUND")) {
            this.vertices.push(station.x, station.y, station.z);
          //}
        });

        

        var legIndices = [];
        this.survey.legsByDate.forEach( leg => {
          if(leg.isUnderground()) { 
            legIndices.push(leg.leg[0].i); legIndices.push(leg.leg[1].i);
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
               
        //Keep out of group until we want to display
        this.group.add(this.legs);
        
        
        
        //var box = new THREE.BoxHelper(this.legs, new THREE.Color('red'));
        //this.group.add(box);
      

        this.camera.position.set(c.x,c.y,c.z+nonindexed.boundingSphere.radius);
        this.camera.up.set(0,0,1);
        this.camera.lookAt(c.x,c.y,c.z);
        this.controls.target = new THREE.Vector3(c.x,c.y,c.z);

        this.viewParameters.targetPosition = new THREE.Vector3(c.x,c.y,c.z);

        //this.controls.maxAzimuthAngle = Math.PI / 4;
        //this.controls.minAzimuthAngle = 0;
       /* this.controls.maxAzimuthAngle=Math.PI;
        this.controls.minAzimuthAngle=Math.PI-1;
        this.controls.maxPolarAngle=Math.PI;
        this.controls.minPolarAngle=0;*/
        this.controls.update();


        //We can't use our own rendering loop because anime.js has it's own one which 
        //also uses requestAnimationFrame.
        // It can be done manually in the inspect console by selecting the world element
        //and using
        //let component = ng.probe($0)._debugContext.component;
        //press space
        //loop this:  
        //   component.animateSurvey()
        //   component.renderer.render(component.scene, component.camera);

        //this.startRenderingLoop();
    });
  


  }

  /**
   * Create the scene
   */
  private createScene() {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    /* Scene */
    THREE.Object3D.DefaultUp=new THREE.Vector3(0,0,1);
    this.scene = new THREE.Scene();
    this.group = new THREE.Object3D();
    //this.group.rotation.x = -Math.PI / 2;
    
    this.scene.add(this.group);

    /* Camera */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.autoRotate=false;
    this.controls.enablePan=false;
    this.controls.enableZoom=true;
    this.controls.autoRotateSpeed=4.0;
    //this.camera.position.z = this.cameraZ;

      /*var axisHelper = new THREE.AxesHelper(2000);
      axisHelper.position.set(404000,123000,0);
      this.group.add(axisHelper);*/


      var skylight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.2 );
      this.group.add( skylight );
      var sunLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
      sunLight.position.set(0,1,1);
      this.group.add(sunLight);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   */
  /*private startRenderingLoop() {

    // Use canvas element in template
  

    let component: WorldComponent = this;
    (function render() {
      requestAnimationFrame(render);
      
      component.animateSurvey();
      component.renderer.render(component.scene, component.camera);
    }());
  }
*/


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
   /* //this.createMountainPointcloud("403_121", 10);
    this.createMountainPointcloud("403_122", 10);
    this.createMountainPointcloud("403_123", 10);
    this.createMountainPointcloud("403_124", 10);
    //this.createMountainPointcloud("404_121", 10);
    this.createMountainPointcloud("404_122", 10);   //1
    this.createMountainPointcloud("404_123", 10);   //1
    this.createMountainPointcloud("404_124", 10);   //1
    //this.createMountainPointcloud("405_121", 10);
    this.createMountainPointcloud("405_122", 10);
    this.createMountainPointcloud("405_123", 10);   //1
    this.createMountainPointcloud("405_124", 10);   //1
    //this.createMountainPointcloud("406_122", 1);
    //this.createMountainPointcloud("406_123", 1);
    //this.createMountainPointcloud("406_124", 1);*/

    this.createMountainPointcloud("404_123", 10);
    this.createMountainPointcloud("405_123", 10);
    //this.createMountainPointcloud("404_124", 10); //broken
    this.createGeometry();
        //this.startRenderingLoop();
  }


}