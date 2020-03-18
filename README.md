# migtimelapse

DEM and Satellite Data
----------------------
```
pip install Pillow
cd src
python retrieveSatelliteTiles.lod13.py
python processAscDem.py
```


Build Instructions
------------------

1. Install NPM.
2. run ```npm install``` to get the dependencies needed.
3. from the src directory
    1. Serve the DEM and satellite files: ```python -m http.server```
    1. Run the angular site: ```ng serve```
    3. view the app at http://localhost:4200.



