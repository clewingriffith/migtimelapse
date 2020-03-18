
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
lod=13
yext=(120,147)
xext=(75,99)

for r in range(*yext):
    for c in range(*xext):
        filename = "rawdata/satellite/lod13/tile_r%d_c%d_lod%d.jpg" %  (r,c,lod)
        if os.path.isfile(filename):
            print("already got %s" % filename)
        else:
            print("downloading %s" % filename)
            response = urllib.request.urlopen("http://gistiles3.arso.gov.si/nukleus_tiles/Gis/NukleusTiles/v50/AgccTile.ashx?gcid=lay_AO_DOF_2014&r=%d&c=%d&lod=%d&lid=lay_ao_dof_2014&f=jpg" % (r,c,lod))
            data = response.read()
            file = open(filename)
            file.write(data)
            file.close()

#print ("Reconstruct with montage 'tile_r*_c*_lod%d.jpg' -geometry +0+0 -tile %dx%d montage.jpg" % (lod,xext[1]-xext[0],yext[1]-yext[0]))
command = "montage 'tile_r*_c*_lod%d.jpg' -geometry +0+0 -tile %dx%d montage.jpg" % (lod,xext[1]-xext[0],yext[1]-yext[0])
print("Run this manually: ",command)
#subprocess.run(command, shell=True)

#The following have been identified as a location matching the 9th level of detail images to their physical location
#If the yextent or xextent are changed, this point will need to be moved.
#The top left hand corner of the tile with image coordinates 1614,4800 corresponds with the top left of the 403000,123000 1km square.
fixedImageX=3618
fixedImageY=3479
width1kmTile=377
fixedX=405
fixedY=123




## LOD 9 Calibrations:




#The offset from GK to TM 
#tm_x_offset = 1397
#tm_y_offset = 1805




for ix in range(-11,10):
    for iy in range(-8,10):
        command = "convert .\montage.jpg -crop %dx%d+%d+%d -resize 256x256 assets/satellite/96TM/256/%d_%d.jpg" % (width1kmTile,width1kmTile,fixedImageX+ix*width1kmTile,fixedImageY+iy*width1kmTile,fixedX+ix,fixedY+1-iy)
        print(command)
        #subprocess.run(command, shell=True)





#http://gistiles3.arso.gov.si/nukleus_tiles/Gis/NukleusTiles/v50/AgccTile.ashx?gcid=lay_AO_DOF_2014&r=1&c=1&lod=3&lid=lay_ao_dof_2014&f=jpg
