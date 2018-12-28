
"""
Get satellite data tiles at various levels of detail
"""

import urllib.request
import os.path
import subprocess

#testfile = urllib.URLopener()
#testfile.retrieve("http://randomsite.com/file.gz", "file.gz")

#lod=3
#r=1
#c=1
#tilefile = urllib.URLopener()
#with urllib.request.urlopen('http://python.org/') as response:
#   html = response.read()
lod=16
yext=(1310,1390)
xext=(850,906)

for r in range(*yext):
    for c in range(*xext):
        filename = "tile_r%d_c%d_lod%d.jpg" %  (r,c,lod)
        if os.path.isfile(filename):
            print("already got %s" % filename)
        else:
            print("downloading %s" % filename)
            response = urllib.request.urlopen("http://gistiles3.arso.gov.si/nukleus_tiles/Gis/NukleusTiles/v50/AgccTile.ashx?gcid=lay_AO_DOF_2014&r=%d&c=%d&lod=%d&lid=lay_ao_dof_2014&f=jpg" % (r,c,lod))
            data = response.read()
            file = open("tile_r%d_c%d_lod%d.jpg" %  (r,c,lod), 'wb')
            file.write(data)
            file.close()

#print ("Reconstruct with montage 'tile_r*_c*_lod%d.jpg' -geometry +0+0 -tile %dx%d montage.jpg" % (lod,xext[1]-xext[0],yext[1]-yext[0]))
command = "montage 'tile_r*_c*_lod%d.jpg' -geometry +0+0 -tile %dx%d montage.jpg" % (lod,xext[1]-xext[0],yext[1]-yext[0])
print("Run this manually: ",command)
#subprocess.run(command, shell=True)

#The following have been identified as a location matching the 16th level of detail images to their physical location
#If the yextent or xextent are changed, this point will need to be moved.
#The top left hand corner of the tile with image coordinates 1614,4800 corresponds with the top left of the 403000,123000 1km square.
fixedImageX=1614
fixedImageY=4800
width1kmTile=3776
fixedX=403
fixedY=123

for ix in range(0,3):
    for iy in range(0,3):
        command = "convert .\montage.jpg -crop %dx%d+%d+%d -resize 2048x2048 %d_%d.jpg" % (width1kmTile,width1kmTile,fixedImageX+ix*width1kmTile,fixedImageY+iy*width1kmTile,fixedX+ix,fixedY+1-iy)
        print(command)
        subprocess.run(command, shell=True)


#http://gistiles3.arso.gov.si/nukleus_tiles/Gis/NukleusTiles/v50/AgccTile.ashx?gcid=lay_AO_DOF_2014&r=1&c=1&lod=3&lid=lay_ao_dof_2014&f=jpg
