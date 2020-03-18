
import subprocess

#The following have been identified as a location matching the 16th level of detail images to their physical location
#If the yextent or xextent are changed, this point will need to be moved.
#The top left hand corner of the tile with image coordinates 1614,4800 corresponds with the top left of the 403000,123000 1km square.
fixedImageX=1614
fixedImageY=4800
width1kmTile=3776
fixedX=403
fixedY=123


#The offset from GK to TM 
tm_x_offset = 1397
tm_y_offset = 1805

for ix in range(0,3):
    for iy in range(0,3):
        command = "convert .\montage.jpg -crop %dx%d+%d+%d -resize 2048x2048 %d_%d.jpg" % (width1kmTile,width1kmTile,fixedImageX+tm_x_offset+ix*width1kmTile,fixedImageY+tm_y_offset+iy*width1kmTile,fixedX+ix,fixedY+1-iy)
        print(command)
        subprocess.run(command, shell=True)
