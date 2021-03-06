import * as THREE from 'three';

export class GlobalViewParameters {

    // angles are in radians
    public azimuthAngle: number = 0;
    public altitudeAngle: number = 0; //0 represents top-down. Math.PI/2 represents sideways on;
    public cameraDistance: number = 1000; //in m

    public targetPosition: THREE.Vector3;
    public _cameraPosition: THREE.Vector3; //calculated for debug only

    public getCameraCartesianPosition():THREE.Vector3 {
        let cameraDelta = new THREE.Vector3();
        cameraDelta.setFromSpherical(new THREE.Spherical(this.cameraDistance, this.altitudeAngle, this.azimuthAngle));
        let newCameraPosition = this.targetPosition.clone();
        newCameraPosition.add(new THREE.Vector3(cameraDelta.x, -cameraDelta.z, cameraDelta.y));
        this._cameraPosition = newCameraPosition;
        return newCameraPosition.clone();
    }

    public showTerrain: boolean = false;
    public terrainResolution: number = 100;  //can be 1, 10, or 100. This is the mesh density in metres, so 1 is the highest res.
    public terrainOpacity: number = 1;
    public terrainWireframe: boolean  = false;
    public showCave: boolean = true;
    public showYear: number = 1994.0; // a decimal value like 2012.23.  The decimal portion represents an amount of exploration done that year between 0 and 1.
    

    public caveOffset = new THREE.Vector3(-350,480,0.0);

    //actually now the non-clipped region, ie the visible mountain.
    public clippedExtent = {
        x: [401000, 407000],
        y: [121000, 127000],
        
    };

    public readonly terrainTileExtent = {
        "1": {
            x: [403, 404],
            y: [122, 123]
        },
        "10": {
            x: [398, 410],
            y: [117, 131]
            },
        "100": {
            x: [398, 410],
            y: [117, 131]
        },
    };


    //region which is clipped off, not the whole extent of the mountain
    ymin = 123000;
    ymax = 124500;
    zmax = 2000;
    xmin = 404500;
    xmax = 405000;
    
}