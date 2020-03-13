
import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild /*, HostListener*/ } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CaveLoaderService } from '../caveloader.service';
import { DEMLoaderService } from '../demloader.service';
import { CaveSurvey } from '../cavesurvey';
import { SurveyStation } from '../cavesurvey';
import { GlobalViewParameters } from '../GlobalViewParameters';
import { DoubleSide, Vector3, Texture } from 'three';


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

  @ViewChild('canvas', { static: true })
  private canvasRef: ElementRef<HTMLCanvasElement>;

  private legs: THREE.LineSegments;
  private vertices = [];
  private renderer: THREE.WebGLRenderer;

  private demPointCloud: THREE.Points;

  //private demMeshMaterial: THREE.MeshLambertMaterial;

  private demMeshMaterials: THREE.MeshStandardMaterial[] = [];
  private terrainObjectByResolution = { 1: [], 10:[], 100:[] };
  private terrainObjectTiles = {}; //LOD objects keyed by tile eg. 404_123
  private terrainGeometriesByResolution = { 1: [], 10:[], 100:[] };

  private clippingPlanes: THREE.Plane[] = [];
  private zmaxPlane: THREE.Plane;
  private xminPlane: THREE.Plane;
  private xmaxPlane: THREE.Plane;
  private yminPlane: THREE.Plane;
  private ymaxPlane: THREE.Plane;
  //private clippingPlaneGeometries: THREE.Geometry[] = [];

  //private _terrainMode: TerrainMode;
  private scene: THREE.Scene;
  private group: THREE.Object3D;
  //private terrainObject: THREE.Object3D;
  private _numLegsToDisplay = 0;

  public rotationSpeedX: number = 0.005;
  public rotationSpeedY: number = 0.01;

  //private animating = true;

  @Input()
  public size: number = 20;


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

    //this.setClippedExtent();
    this.zmaxPlane.constant = this.viewParameters.zmax;
    this.xminPlane.constant = this.viewParameters.xmin;
    this.clippingPlanes = [this.zmaxPlane, this.xminPlane, this.xmaxPlane, this.yminPlane, this.ymaxPlane];
    //it appears that this.demMeshMaterial is only one of the terrain segments: it probably 
    //shouldn't be a class variable.
    this.demMeshMaterials.forEach(m => m.opacity = this.viewParameters.terrainOpacity);
    this.demMeshMaterials.forEach(m => m.wireframe = this.viewParameters.terrainWireframe);
    this.demMeshMaterials.forEach(m => m.clippingPlanes = this.clippingPlanes);

    //show the appropriate mesh for the resolution
    //remove the existing meshes
    for(let tile in this.terrainObjectTiles) {
      this.group.remove(this.terrainObjectTiles[tile]); //.forEach(t => this.group.remove(t));
    }
    for(let tile in this.terrainObjectTiles) {
      let lod = this.terrainObjectTiles[tile];
      this.group.add(lod);
      lod.update(this.camera);
      //this.terrainObjectTiles[tile].forEach(t => this.group.add(t));
    }

   
    // for(let res in this.terrainObjectByResolution) {
    //   this.terrainObjectByResolution[res].forEach(t => this.group.remove(t));
    // }
    // //and then add the one for this resolution
    // this.terrainObjectByResolution[this.viewParameters.terrainResolution].forEach(t => this.group.add(t));
    

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

  //use displacement map
  private createTerrainTile(tile: string, resolution: number) {
    this.demloader.readDEMHeightData(tile, resolution).subscribe( arraybuffer => {
      const geometry = new THREE.BufferGeometry();
      //const geometry = new THREE.PlaneBufferGeometry(1000,1000,99,99);
      //const demPointArray = new Float32Array(arraybuffer);

      const demHeightPO2ArrayBuffer = [];
      for(let i=0; i<512; i++) {
        for(let j=0; j<512; j++) {
          demHeightPO2ArrayBuffer.push(1700.0);
        }
      }
      const demHeightFloatArrayPO2 = new Float32Array(demHeightPO2ArrayBuffer); //.length/3);

      const demHeightFloatArray = new Float32Array(arraybuffer); //.length/3);
      const demHeightArrayBuffer = [];
      for(let i=0; i<demHeightFloatArray.length; i++) {
        demHeightArrayBuffer.push(demHeightFloatArray[i]);
      }
      const demPointArrayBuffer = [];
      let demHeightArray = new Uint16Array(demHeightArrayBuffer);

      //set height to zero
      /*for(let offset=0; offset<demPointArray.length/3; offset++) {
       // demHeightArray[offset] = demPointArray[3*offset+2];
        demPointArray[3*offset+2] = 0.0;
      } */

      
     // used the buffer to create a DataTexture
      
      //displacementMap.needsUpdate = true;

      let textureLoader = new THREE.TextureLoader();

      let texture = textureLoader.load( 'assets/satellite/96TM/256/' + tile + '.jpg' );
      texture.generateMipmaps = true;
      //texture.minFilter = THREE.LinearFilter;
      //let texture = textureLoader.load( 'assets/satellite/96TM/256/uv_grid_opengl.jpg' );
      //let displacementMap:Texture = textureLoader.load( 'assets/dem/96TM/TM1_' + tile + '.'+resolution+'m.height.png' );
      //displacementMap.format = THREE.LuminanceFormat;
      //displacementMap.type = THREE.FloatType;
      //let displacementMap = new THREE.DataTexture( demHeightFloatArrayPO2, 512, 521, THREE.LuminanceFormat, THREE.FloatType, THREE.UVMapping );
      //displacementMap.needsUpdate = true;
      //let normalMap = textureLoader.load( 'assets/dem/96TM/TM1_' + tile + '.normal.png' );
      //normalMap.minFilter = THREE.LinearFilter;
      let tilex:number = 1000*Number(tile.split("_")[0]);
      let tiley:number = 1000*Number(tile.split("_")[1]);

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
          //indices.push( a, b, d );
          //indices.push( b, c, d );
          indices.push( d,b,a );
          indices.push( d,c,b );
        }
      }

      
       /* for ( ix=0; ix<gridX; ix++ ) {
          for ( iy=0; iy<gridY; iy++ ) {
            demPointArrayBuffer.push(tilex+ix*resolution);
            demPointArrayBuffer.push(tiley+iy*resolution);
            demPointArrayBuffer.push(0.0);
          }
        }*/
      var segment_width = 1000 / gridX;
    	var segment_height = 1000 / gridY;
      //var width_half = 500;
	    //var height_half = 500;
      for ( iy = 0; iy < gridY1; iy ++ ) {
		    var y = iy * segment_height;
  		  for ( ix = 0; ix < gridX1; ix ++ ) {
          var x = ix * segment_width;
          demPointArrayBuffer.push(tilex+x,tiley+y,demHeightFloatArray[ix*gridY1+iy])
          uvs.push( ix / gridX );
          uvs.push(  ( iy / gridY ) );
          
  		  }

	    }

      //indices.push(0,1,100);
      
 
      

      geometry.setIndex(indices);
      geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(demPointArrayBuffer), 3 ) );
      geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
      geometry.computeVertexNormals();
      let tileCenter = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(tileCenter);
      geometry.center();
      //.translate(tileCenter.x, tileCenter.y, tileCenter.z);
      //this.terrainGeometriesByResolution[resolution].push(geometry);
      //var demMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
      
      let terrainMaterial = new THREE.MeshStandardMaterial( { color: 0xcccccc, map: texture, transparent:true, wireframe: false } );
      terrainMaterial.metalness = 0.0;
      terrainMaterial.roughness = 1.0;

      //terrainMaterial.normalMap = normalMap;
      
      
      //terrainMaterial.normalMapType = THREE.ObjectSpaceNormalMap;
      terrainMaterial.clippingPlanes = this.clippingPlanes;
      terrainMaterial.clipIntersection = true;
      terrainMaterial.side = THREE.DoubleSide;
     
      this.demMeshMaterials.push(terrainMaterial);

      let terrainObject = new THREE.Group;
      
      let terrainMesh = new THREE.Mesh( geometry, terrainMaterial );
      

      terrainObject.add(terrainMesh);
      

      // store the terrain meshes against their resolution so that we can selectively display
      // based on what resolution we want to see
      this.terrainObjectByResolution[resolution].push(terrainObject);
      if(this.terrainObjectTiles[tile] === undefined) {
        let lod = new THREE.LOD();
        lod.position.set(tileCenter.x,tileCenter.y,tileCenter.z);
        this.terrainObjectTiles[tile] = lod; 
       
        //geometry.boundingBox.getCenter(this.terrainObjectTiles[tile].position);
      }

      let terrainLOD:THREE.LOD = this.terrainObjectTiles[tile];
      const distanceByRes = {
        "1": 0,
        "10": 3000,
        "100": 8000
      } 
      //if(resolution == 1) {
     // terrainLOD.addLevel(terrainObject, 0.0); //scale so 10m res is displayed at 2km or closer
     // } else {
        terrainLOD.addLevel(terrainObject, distanceByRes[resolution]); //scale so 10m res is displayed at 2km or closer
      //}
      //geometry.boundingBox.getCenter(terrainLOD.position);
      //Keep out of the scene until we want to display
      //this.group.add(terrainObject);


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
    this.renderer.localClippingEnabled = true;
    /* Scene */
    THREE.Object3D.DefaultUp=new THREE.Vector3(0,0,1);
    this.scene = new THREE.Scene();


    
    this.scene.background = new THREE.Color('#92bbff');
    this.scene.fog = new THREE.FogExp2('#92bbff', 0.00015);

    this.group = new THREE.Object3D();
    //this.group.rotation.x = -Math.PI / 2;
    
    this.scene.add(this.group);




    this.setClippedExtent();

  


    //this.clippingPlanes.push(new THREE.Plane(new THREE.Vector3( -1, 0, 0 ), 404000.0));

    //add object for clipping plane
/*
    this.clippingPlanes.forEach( clippingPlane => {
      const planesize = 8000;
      let clipGeom = new THREE.PlaneBufferGeometry(planesize,planesize,1,1);
      let x = clippingPlane.normal.x != 0 ? clippingPlane.constant : 403000+planesize/2;
      let y = clippingPlane.normal.y != 0 ? clippingPlane.constant : 123000+planesize/2;
      let z = clippingPlane.normal.z != 0 ? clippingPlane.constant : 0;
      
      //clipGeom.translate(x,y,z);

      let clipMaterial = new THREE.MeshStandardMaterial( {
        color: 'red',
        metalness: 0.1,
        roughness: 0.75,
        clippingPlanes: this.clippingPlanes.filter( p => p !== clippingPlane ),
       // stencilWrite: false,
        stencilWrite: true,
        stencilRef: 0,
        stencilFunc: THREE.EqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp,
        stencilZFail: THREE.ReplaceStencilOp,
        stencilZPass: THREE.ReplaceStencilOp,
      } );
  

      let clipMesh = new THREE.Mesh(clipGeom, clipMaterial);
      clipMesh.onAfterRender = () => {this.renderer.clearStencil();}
      clipMesh.renderOrder = 6;
      this.group.add(clipMesh);

    });
*/

    
    
    


      // new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0 ),
      // new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
    
    //let planeObject = new THREE.PlaneBufferGeometry( 1000, 1000 );
    //let poGroup = new THREE.Group();
  
    //let stencilGroup = this.createPlaneStencilGroup( /*main mesh*/group, plane, 1 );

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



      var skylight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.2 );
      this.group.add( skylight );
      var sunLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
      sunLight.position.set(0,1,1);
      this.group.add(sunLight);
  }

  private setClippedExtent() {

    let vertices:THREE.Vector3[] = [
      new THREE.Vector3(this.viewParameters.clippedExtent.x[0], this.viewParameters.clippedExtent.y[0],  0),
      new THREE.Vector3(this.viewParameters.clippedExtent.x[0], this.viewParameters.clippedExtent.y[0],  this.viewParameters.zmax),
      new THREE.Vector3(this.viewParameters.clippedExtent.x[0], this.viewParameters.clippedExtent.y[1],  this.viewParameters.zmax),
      new THREE.Vector3(this.viewParameters.clippedExtent.x[0], this.viewParameters.clippedExtent.y[1],  0),

      new THREE.Vector3(this.viewParameters.clippedExtent.x[1], this.viewParameters.clippedExtent.y[0],  0),
      new THREE.Vector3(this.viewParameters.clippedExtent.x[1], this.viewParameters.clippedExtent.y[0],  this.viewParameters.zmax),
      new THREE.Vector3(this.viewParameters.clippedExtent.x[1], this.viewParameters.clippedExtent.y[1],  this.viewParameters.zmax),
      new THREE.Vector3(this.viewParameters.clippedExtent.x[1], this.viewParameters.clippedExtent.y[1],  0),
    ];
    
    //this.let xMinPlane = new THREE.Plane(new THREE.Vector3( 1, 0, 0 ), this.viewParameters.clippedExtent.x[0]);
    this.xmaxPlane = new THREE.Plane(new THREE.Vector3( 1, 0, 0 ), -this.viewParameters.xmax);
    this.xminPlane = new THREE.Plane(new THREE.Vector3( -1, 0, 0 ), this.viewParameters.xmin);
    this.yminPlane = new THREE.Plane(new THREE.Vector3( 0, -1, 0 ), this.viewParameters.ymin);
    this.ymaxPlane = new THREE.Plane(new THREE.Vector3( 0, 1, 0 ), -this.viewParameters.ymax);
    //let zMinPlane = new THREE.Plane(new THREE.Vector3( 0, 0, 1 ), -this.viewParameters.clippedExtent.z[0]);
    this.zmaxPlane = new THREE.Plane(new THREE.Vector3( 0, 0, -1 ), this.viewParameters.zmax);

    this.clippingPlanes = [this.zmaxPlane, this.xminPlane, this.xmaxPlane, this.yminPlane, this.ymaxPlane];
    //this.clippingPlanes.push();

    let clipMat = new THREE.MeshStandardMaterial({
      color: 'blue',
      opacity: 0.1,
      transparent:true,
      /*stencilWrite : true,
      stencilRef: 0,
      stencilFunc:  THREE.NotEqualStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp*/
    });
/*
  2+----+6
  /    /|
1+----+5|
 | 3  | +7
 |    |/
0+----+4
*/
    // let xMinGeom = new THREE.Geometry();
    // xMinGeom.vertices = vertices;
    // xMinGeom.faces.push( new THREE.Face3(0,1,2));
    // xMinGeom.faces.push( new THREE.Face3(2,3,0));
    // this.clippingPlaneGeometries.push(xMinGeom);
    //let xMinMesh = new THREE.Mesh(xMinGeom, clipMat);
    //this.group.add(this.createPlaneStencilGroup(xMinMesh, xMinPlane));
    //this.group.add(xMinMesh);
    //xMinMesh.onAfterRender  = () => {this.renderer.clearStencil();}
    

    // let xMaxGeom = new THREE.Geometry();
    // xMaxGeom.vertices = vertices;
    // xMaxGeom.faces.push( new THREE.Face3(4,7,6));
    // xMaxGeom.faces.push( new THREE.Face3(4,6,5));
    // this.clippingPlaneGeometries.push(xMaxGeom);
    //let xMaxMesh = new THREE.Mesh(xMaxGeom, clipMat);
    //this.group.add(xMaxMesh);
    //xMaxMesh.onAfterRender  = () => {this.renderer.clearStencil();}
    
    // let yMinGeom = new THREE.Geometry();
    // yMinGeom.vertices = vertices;
    // yMinGeom.faces.push( new THREE.Face3(0,4,5));
    // yMinGeom.faces.push( new THREE.Face3(0,5,1));
    // this.clippingPlaneGeometries.push(yMinGeom);
    //let yMinMesh = new THREE.Mesh(yMinGeom, clipMat);
    //this.group.add(yMinMesh);
    //yMinMesh.onAfterRender  = () => {this.renderer.clearStencil();}
    
    // let yMaxGeom = new THREE.Geometry();
    // yMaxGeom.vertices = vertices;
    // yMaxGeom.faces.push( new THREE.Face3(6,3,2));
    // yMaxGeom.faces.push( new THREE.Face3(6,7,3));
    // this.clippingPlaneGeometries.push(yMaxGeom);
    //let yMaxMesh = new THREE.Mesh(yMaxGeom, clipMat);
    //this.group.add(yMaxMesh);
    //yMaxMesh.onAfterRender  = () => {this.renderer.clearStencil();}

    let zMinGeom = new THREE.Geometry();
    zMinGeom.vertices = vertices;
    zMinGeom.faces.push( new THREE.Face3(0,7,4));
    zMinGeom.faces.push( new THREE.Face3(0,3,7));
   // this.clippingPlaneGeometries.push(zMinGeom);

    let groundMat = new THREE.MeshBasicMaterial({
      color: 'black',
      side: THREE.DoubleSide
    });

    let zMinMesh = new THREE.Mesh(zMinGeom, groundMat);

  }


  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
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

    
    for (let res of [100, 10, 1]) {
      let extent = this.viewParameters.terrainTileExtent[res];
      for (let i = extent.x[0]; i <= extent.x[1]; i++) {
        for (let j = extent.y[0]; j <= extent.y[1]; j++) {
          this.createTerrainTile(i + "_" + j, res);
        }
      }
    }
 

   

/*
    this.createMountainPointcloud("404_122", 10);
    this.createMountainPointcloud("405_122", 10);
    this.createMountainPointcloud("404_123", 10);
    this.createMountainPointcloud("405_123", 10);
    this.createMountainPointcloud("404_124", 10);
    this.createMountainPointcloud("405_124", 10); */
/*
    this.createMountainPointcloud("404_122", 1);
    this.createMountainPointcloud("405_122", 1);
    this.createMountainPointcloud("404_123", 1);
    this.createMountainPointcloud("405_123", 1);
    this.createMountainPointcloud("404_124", 1); 
    this.createMountainPointcloud("405_124", 1); */

    // 404,124 405,124
    // 404,123 405,123
    // 404,122 405,122

    //this.createMountainPointcloud("404_124", 10); //broken
    this.createGeometry();
        //this.startRenderingLoop();
  }


}