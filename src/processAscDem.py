
import sys
import array
import math
""""
Takes a single file as an argument which is the ascii DEM format from slovenian LIDAR
the format is
x;y;alt\n
x;y;alt\n
There are 1million lines in each file, representing a 1000x1000 grid.

The points in the .asc file are not actually arranged in a 1000x1000 grid.
instead they appear to be in 4 unevenly sized subgrids of 
370x512, 370x478, 630x512, 630x478.
The approach I take is based on the fact that the points are at roughly 1m spacing
I find out the minimum x and y coordinates, and then subtract that from each point 
and round to the nearest metre to give integer x,y coordinates from 0,999

I then read in the neighbouring tiles to the north, east and northeast and add on 
a row or column to create a set of points 1001x1001. These are then output
as arrays at 1m, 10m and 100m resolution.

This script takes a single argument, the name of the raw .asc file for a particular DEM
tile. It assumes the existence of the neighbouring tiles, so we need to have one more row
and column to the north/east than we are planning to output.
"""
tilefilename = sys.argv[1];  #eg. ".\assets\GK1_403_124.asc"
tilex = int(tilefilename[-11:-8]) #eg. 403
tiley = int(tilefilename[-7:-4]) #eg. 124
#We also need to read the tiles to the north and east to get the last row or column of points
#Reading the whole neighbour tile is a waste of memory, but I don't care
easttilefilename = "%s%d_%d.asc" % (tilefilename[0:-11], tilex+1, tiley)
northtilefilename = "%s%d_%d.asc" % (tilefilename[0:-11], tilex, tiley+1)
northeasttilefilename = "%s%d_%d.asc" % (tilefilename[0:-11], tilex+1, tiley+1)
print(sys.argv[1])


def readTile(filename):
    print("reading ",filename)
    inputFile = open(filename,'r')
    numlines = 0
    px=0    #record previous points so we can detect large
    py=0
    ix=0
    iy=0
    xlboundaries = set()
    ylboundaries = set()
    xuboundaries = set()
    yuboundaries = set()
    while True:
        line = inputFile.readline()
        if not line:
            break
        #lines.append(line)
        x,y,z = line.split(';')
        fx=float(x)
        fy=float(y)
        if(abs(fx-px) > 100):
            #print(px,fx)
            xlboundaries.add(fx)
            xuboundaries.add(px)
        if(abs(fy-py) > 100):
            #print(py,fy)
            ylboundaries.add(fy)
            yuboundaries.add(py)
        px=fx
        py=fy
        numlines+=1
    inputFile.close()

    xmin=min(xlboundaries)
    ymin=min(ylboundaries)

    inputFile = open(filename,'r')

    iymax = numlines//1000
    #print (iymax)
    bigArray={}

    while True:
        line = inputFile.readline()
        if not line:
            break
        x,y,z = line.split(';')
        fx=float(x)
        fy=float(y)
        ix=round(fx-xmin)
        iy=round(fy-ymin)
        bigArray[(ix,iy)]=line

    print("read ", numlines, "lines")
    return bigArray





bigArray = readTile(tilefilename)
eastArray = readTile(easttilefilename)
northArray = readTile(northtilefilename)
northeastArray = readTile(northeasttilefilename)

#extend point array with data from neibouring tiles to make a 1001x1001 grid
bigArray[(1000,1000)]=northeastArray[(0,0)]
for iy in range(0,1000):
    bigArray[(1000,iy)]=eastArray[(0,iy)]
for ix in range(0,1000):
    bigArray[(ix,1000)]=northArray[(ix,0)]

#define output arrays
a1mArray = array.array('f')
a10mArray = array.array('f')
a100mArray = array.array('f')


#1m sampling
for ix in range(0,1001):
    for iy in range(0,1001):
        a1mArray.extend([float(k) for k in bigArray[(ix,iy)].split(';')])
 
#10m sampling
for ix in range(0,101):
    for iy in range(0,101):
        a10mArray.extend([float(k) for k in bigArray[(10*ix,10*iy)].split(';')])
 
#100m sampling
for ix in range(0,11):
    for iy in range(0,11):
        a100mArray.extend([float(k) for k in bigArray[(100*ix,100*iy)].split(';')])


a1mOutputFile = open(sys.argv[1]+".1m.bin",'wb')
a1mOutputFile.write(a1mArray.tobytes())
a1mOutputFile.close()
a10mOutputFile = open(sys.argv[1]+".10m.bin",'wb')
a10mOutputFile.write(a10mArray.tobytes())
a10mOutputFile.close()
a100mOutputFile = open(sys.argv[1]+".100m.bin",'wb')
a100mOutputFile.write(a100mArray.tobytes())
a100mOutputFile.close()
