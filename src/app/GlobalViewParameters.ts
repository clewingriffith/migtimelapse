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

    public showTerrain: boolean = true;
    public terrainOpacity: number = 1;
    public terrainWireframe: boolean  = true;

}