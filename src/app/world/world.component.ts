
import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild /*, HostListener*/ } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { CaveLoaderService } from '../caveloader.service';
import { DEMLoaderService } from '../demloader.service';
import { CaveSurvey } from '../cavesurvey';
import { SurveyStation } from '../cavesurvey';
import { GlobalViewParameters } from '../GlobalViewParameters';
import { DoubleSide } from 'three';


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

  //private demMeshMaterial: THREE.MeshLambertMaterial;

  private demMeshMaterials: THREE.MeshLambertMaterial[] = [];
  private terrainObjectByResolution = { 1: [], 10:[], 100:[] };
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
    for(let res in this.terrainObjectByResolution) {
      this.terrainObjectByResolution[res].forEach(t => this.group.remove(t));
    }
    //and then add the one for this resolution
    this.terrainObjectByResolution[this.viewParameters.terrainResolution].forEach(t => this.group.add(t));
    

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

      var texture = new THREE.TextureLoader().load( 'assets/satellite/96TM/256/' + tile + '.jpg' );
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
      
      /*var segment_width = 1000 / gridX;
    	var segment_height = 1000 / gridY;
      var width_half = 500;
	    var height_half = 500;*/
      for ( iy = 0; iy < gridY1; iy ++ ) {
		    //var y = iy * segment_height - height_half;
  		  for ( ix = 0; ix < gridX1; ix ++ ) {
	    		//var x = ix * segment_width - width_half;
			    uvs.push(  ( iy / gridY ) );
          uvs.push( ix / gridX );
  		  }

	    }

      //indices.push(0,1,100);
      
      geometry.setIndex(indices);
      geometry.addAttribute( 'position', new THREE.BufferAttribute( demPointArray, 3 ) );
      geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
      geometry.computeVertexNormals();
      //this.terrainGeometriesByResolution[resolution].push(geometry);
      //var demMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
      
      let terrainMaterial = new THREE.MeshLambertMaterial( { color: 0xcccccc, map: texture, transparent:true, wireframe: false } );
      terrainMaterial.clippingPlanes = this.clippingPlanes;
      terrainMaterial.clipIntersection = true;
      terrainMaterial.side = THREE.DoubleSide;
      //terrainMaterial.stencilFunc = THREE.AlwaysStencilFunc;
      //terrainMaterial.stencilWrite = true;
      //terrainMaterial.depthTest = false;
      //terrainMaterial.stencilFail = THREE.DecrementWrapStencilOp;
      //terrainMaterial.stencilZFail = THREE.DecrementWrapStencilOp;
      //terrainMaterial.stencilZPass = THREE.DecrementWrapStencilOp;
      //terrainMaterial.side = THREE.FrontSide;

     /* for(let i=0; i<6; i++) {
        //We need to write the mesh twice, once in a material which sets the stencil buffer appropriate to the clipping
        //and once normally.
        let stencilGroup = new THREE.Group();
        let terrainStencilBaseMaterial = new THREE.MeshBasicMaterial();
        terrainStencilBaseMaterial.depthWrite = false;
        terrainStencilBaseMaterial.depthTest = false;
        terrainStencilBaseMaterial.colorWrite = false;
        terrainStencilBaseMaterial.stencilWrite = true;
        terrainStencilBaseMaterial.stencilFunc = THREE.AlwaysStencilFunc
        terrainStencilBaseMaterial.clippingPlanes = [this.clippingPlanes[i]];

        let terrainStencilFrontMaterial = terrainStencilBaseMaterial.clone();
        terrainStencilFrontMaterial.side = THREE.FrontSide;
        terrainStencilFrontMaterial.stencilFail = THREE.DecrementWrapStencilOp;
        terrainStencilFrontMaterial.stencilZFail = THREE.DecrementWrapStencilOp;
        terrainStencilFrontMaterial.stencilZPass = THREE.DecrementWrapStencilOp;
        let terrainStencilFrontMesh = new THREE.Mesh( geometry, terrainStencilFrontMaterial );
        terrainStencilFrontMesh.renderOrder = i;
        stencilGroup.add(terrainStencilFrontMesh);

        let terrainStencilBackMaterial = terrainStencilBaseMaterial.clone();
        terrainStencilBackMaterial.side = THREE.BackSide;
        terrainStencilBackMaterial.stencilFail = THREE.IncrementWrapStencilOp;
        terrainStencilBackMaterial.stencilZFail = THREE.IncrementWrapStencilOp;
        terrainStencilBackMaterial.stencilZPass = THREE.IncrementWrapStencilOp;
       
        let terrainStencilBackMesh = new THREE.Mesh( geometry, terrainStencilBackMaterial );
        terrainStencilBackMesh.renderOrder = i;
        stencilGroup.add(terrainStencilBackMesh);

        let planeMat = new THREE.MeshStandardMaterial( {
          color: 0xE91E63,
          metalness: 0.1,
          roughness: 0.75,
          stencilWrite: true,
					stencilRef: 0,
          stencilFunc: THREE.NotEqualStencilFunc,
          stencilFail: THREE.ReplaceStencilOp,
          stencilZFail: THREE.ReplaceStencilOp,
          stencilZPass: THREE.ReplaceStencilOp,
        } );
        let po = new THREE.Mesh( this.clippingPlaneGeometries[i], planeMat );
        po.onAfterRender = function ( renderer ) {
          renderer.clearStencil();
        };
        po.renderOrder = i + 1.1;

        this.group.add(stencilGroup);
        this.group.add(po);
      }
*/
      this.demMeshMaterials.push(terrainMaterial);

      let terrainObject = new THREE.Group;
      
      let terrainMesh = new THREE.Mesh( geometry, terrainMaterial );
      //terrainMesh.renderOrder = 10;

      terrainObject.add(terrainMesh);
      //terrainObject.add(terrainStencilFrontMesh);
      //terrainObject.add(terrainStencilBackMesh);
      
      //This is to move the 96TM tiles to match the GK ones which is how the cave position is defined.
      //We could alternatively move the fixed point for the cave, but for the moment, we move the entire mountain.
      //terrainObject.translateX(370.0);
      //terrainObject.translateY(-478);




 //     terrainObject.position.x = 370.0;
 //     terrainObject.position.y = -478.0;

      

      // store the terrain meshes against their resolution so that we can selectively display
      // based on what resolution we want to see
      this.terrainObjectByResolution[resolution].push(terrainObject);

      //Keep out of the scene until we want to display
      this.group.add(terrainObject);
      
      //var demPointCloud = new THREE.Points(geometry, demMaterial);
      //geometry.computeBoundingBox();
      //geometry.computeBoundingSphere();
      
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
    this.renderer.localClippingEnabled = true;
    /* Scene */
    THREE.Object3D.DefaultUp=new THREE.Vector3(0,0,1);
    this.scene = new THREE.Scene();


    
    this.scene.background = new THREE.Color('#92bbff');
    this.scene.fog = new THREE.FogExp2('#92bbff', 0.00025);

    this.group = new THREE.Object3D();
    //this.group.rotation.x = -Math.PI / 2;
    
    this.scene.add(this.group);


    //Add ground
   /* let groundGeom = new THREE.PlaneBufferGeometry(1000,2000,1,1);
    groundGeom.translate(405000,123000,0);
    let groundMaterial = new THREE.MeshStandardMaterial();
    //groundMaterial.depthWrite = false;
    groundMaterial.depthTest = false;
    groundMaterial.colorWrite = false;
    groundMaterial.stencilWrite = true;
    groundMaterial.stencilRef = 1
    groundMaterial.stencilFunc = THREE.AlwaysStencilFunc;
    groundMaterial.stencilZFail = THREE.ReplaceStencilOp,
    groundMaterial.stencilZPass = THREE.ReplaceStencilOp;
    groundMaterial.stencilFail = THREE.ReplaceStencilOp;
    groundMaterial.side = THREE.FrontSide;
    //groundMaterial.color = new THREE.Color('brown');
    let groundMesh = new THREE.Mesh(groundGeom, groundMaterial);
    //groundMesh.renderOrder = 1;
    this.group.add(groundMesh);*/
    //this.clippingPlanes.push(new THREE.Plane(new THREE.Vector3( 1, 0, 0 ), -404000.0));
    //this.clippingPlanes.push(new THREE.Plane(new THREE.Vector3( 0, 0, -1 ), 1500.0));


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
/*
  private createPlaneStencilGroup(geometry, plane) {
    
      var group = new THREE.Group();
      var baseMat = new THREE.MeshBasicMaterial();
      baseMat.depthWrite = false;
      baseMat.depthTest = false;
      baseMat.colorWrite = false;
      baseMat.stencilWrite = true;
      baseMat.stencilFunc = THREE.AlwaysStencilFunc;

      // back faces
      var mat0 = baseMat.clone();
      mat0.side = THREE.BackSide;
      mat0.clippingPlanes = [ plane ];
      mat0.stencilFail = THREE.IncrementWrapStencilOp;
      mat0.stencilZFail = THREE.IncrementWrapStencilOp;
      mat0.stencilZPass = THREE.IncrementWrapStencilOp;

      var mesh0 = new THREE.Mesh( geometry, mat0 );
      //mesh0.renderOrder = renderOrder;
      group.add( mesh0 );

      // front faces
      var mat1 = baseMat.clone();
      mat1.side = THREE.FrontSide;
      mat1.clippingPlanes = [ plane ];
      mat1.stencilFail = THREE.DecrementWrapStencilOp;
      mat1.stencilZFail = THREE.DecrementWrapStencilOp;
      mat1.stencilZPass = THREE.DecrementWrapStencilOp;

      var mesh1 = new THREE.Mesh( geometry, mat1 );
      //mesh1.renderOrder = renderOrder;

      group.add( mesh1 );

      return group;

    
  }
*/
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
    this.group.add(zMinMesh);
    //zMinMesh.onAfterRender  = () => {this.renderer.clearStencil();}
    
    // let zMaxGeom = new THREE.Geometry();
    // zMaxGeom.vertices = vertices;
    // zMaxGeom.faces.push( new THREE.Face3(1,5,6));
    // zMaxGeom.faces.push( new THREE.Face3(1,6,2));
    // this.clippingPlaneGeometries.push(zMaxGeom);
    // let zMaxMesh = new THREE.Mesh(zMaxGeom, clipMat);
    //this.group.add(zMaxMesh);
    //zMaxMesh.onAfterRender  = () => {this.renderer.clearStencil();}
    

    

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

    for(let i=401; i<407; i++) {
      for(let j=121; j<127; j++) {
        this.createMountainPointcloud(i+"_"+j, 100);
        this.createMountainPointcloud(i+"_"+j, 10);
       // this.createMountainPointcloud(i+"_"+j, 1);  //this one is a bit crazy.
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