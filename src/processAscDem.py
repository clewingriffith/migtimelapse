
from PIL import Image
import sys
import array
import math
import os.path

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
def processSingleAsciiTile(tilefilename): #eg. ".\rawdata\dem\96TM\TM1_403_124.asc"
    tilex = int(tilefilename[-11:-8]) #eg. 403
    tiley = int(tilefilename[-7:-4]) #eg. 124
    #We also need to read the tiles to the north and east to get the last row or column of points
    #Reading the whole neighbour tile is a waste of memory, but I don't care
    easttilefilename = "%s%d_%d.asc" % (tilefilename[0:-11], tilex+1, tiley)
    northtilefilename = "%s%d_%d.asc" % (tilefilename[0:-11], tilex, tiley+1)
    northeasttilefilename = "%s%d_%d.asc" % (tilefilename[0:-11], tilex+1, tiley+1)
    #If we are on the edge, just bail out
    if not os.path.isfile(easttilefilename) or not os.path.isfile(northtilefilename) or not os.path.isfile(northeasttilefilename):
        return

    print(tilefilename)
    bigArray = readTile(tilefilename)
    eastArray = readTile(easttilefilename)
    northArray = readTile(northtilefilename)
    northeastArray = readTile(northeasttilefilename)

    #extend point array with data from neibouring tiles to make a 1001x1001 grid

    #this is a hack in case the data isn't there
    try:
        bigArray[(1000,1000)]=northeastArray[(0,0)]
    except KeyError:
        bigArray[(1000,1000)]=bigArray[(999,999)]
    for iy in range(0,1000):
        bigArray[(1000,iy)]=eastArray[(0,iy)]
    for ix in range(0,1000):
        bigArray[(ix,1000)]=northArray[(ix,0)]

    #define output arrays
    a1mArray = array.array('f')
    a10mArray = array.array('f')
    a100mArray = array.array('f')

    #Just the height components
    z1mArray = array.array('f')  ### IGNORE COMMENT # represent height as a 32bit int which will end up as a 16bit int in PNG
    z10mArray = array.array('f') ### IGNORE COMMENT  # represent height as a 32bit int which will end up as a 16bit int in PNG
    z100mArray = array.array('f')
    z1mArray16bit = array.array('H')
    z10mArray16bit = array.array('H')
    z100mArray16bit = array.array('H')

    #1m sampling
    for ix in range(0,1001):
        for iy in range(0,1001):
            x,y,z = [float(k) for k in bigArray[(ix,iy)].split(';')]
            a1mArray.extend([x,y,z])
            #z1mArray.append(int(30*z)) #scale z to a range of roughly 0-60,000  (assuming float range 0.0->2000.0m )
            z1mArray.append(z);
            z1mArray16bit.append(int(65535*(z/2000)))

    
    #10m sampling
    for ix in range(0,101):
        for iy in range(0,101):
            x,y,z = [float(k) for k in bigArray[(10*ix,10*iy)].split(';')]
            a10mArray.extend([x,y,z])
            z10mArray.append(z)
            z10mArray16bit.append(int(65535*(z/2000)))
    
    #100m sampling
    for ix in range(0,11):
        for iy in range(0,11):
            x,y,z = [float(k) for k in bigArray[(100*ix,100*iy)].split(';')]
            a100mArray.extend([x,y,z])
            z100mArray.append(z)
            z100mArray16bit.append(int(65535*(z/2000)))


    srcTileFilename = tilefilename
    dstTileFileprefix = srcTileFilename.replace("rawdata", "assets").replace(".asc", "")
    a1mOutputFile = open(dstTileFileprefix+".1m.bin",'wb')
    a1mOutputFile.write(a1mArray.tobytes())
    a1mOutputFile.close()
    a10mOutputFile = open(dstTileFileprefix+".10m.bin",'wb')
    a10mOutputFile.write(a10mArray.tobytes())
    a10mOutputFile.close()
    a100mOutputFile = open(dstTileFileprefix+".100m.bin",'wb')
    a100mOutputFile.write(a100mArray.tobytes())
    a100mOutputFile.close()

    # height map
    heightMapFile1m = open(dstTileFileprefix+".1m.height.bin", "wb")
    heightMapFile1m.write(z1mArray.tobytes())
    heightMapFile1m.close()
    Image.frombytes('I;16', (1001,1001), z1mArray16bit.tobytes()).transpose(Image.FLIP_TOP_BOTTOM).save(dstTileFileprefix+".1m.height.png")
    heightMapFile10m = open(dstTileFileprefix+".10m.height.bin", "wb")
    heightMapFile10m.write(z10mArray.tobytes())
    heightMapFile10m.close()
    Image.frombytes('I;16', (101,101), z10mArray16bit.tobytes()).transpose(Image.FLIP_TOP_BOTTOM).save(dstTileFileprefix+".10m.height.png")
    heightMapFile100m = open(dstTileFileprefix+".100m.height.bin", "wb")
    heightMapFile100m.write(z100mArray.tobytes())
    heightMapFile100m.close()
    Image.frombytes('I;16', (11,11), z100mArray16bit.tobytes()).transpose(Image.FLIP_TOP_BOTTOM).save(dstTileFileprefix+".100m.height.png")


    #Generate normal map
    normalBytes = array.array('B')
    #normalmapFile = open(dstTileFileprefix+".normal.ppm", 'w')
    #normalmapFile.write('P3\n')
    #normalmapFile.write('999 999\n')
    #normalmapFile.write('255\n')
    for iy in range(1,1000):
        for ix in range(1,1000):
            #x0,y0,z0 = [float(k) for k in bigArray[(ix,iy)].split(';')]
            xl,yl,zl = [float(k) for k in bigArray[(ix-1,iy)].split(';')]
            xr,yr,zr = [float(k) for k in bigArray[(ix+1,iy)].split(';')]
            xu,yu,zu = [float(k) for k in bigArray[(ix,iy+1)].split(';')]
            xd,yd,zd = [float(k) for k in bigArray[(ix,iy-1)].split(';')]
            nx = zl - zr
            ny = zd - zu
            nz = 2.0
            #normalmapFile.write('%d %d %d ' % normalize8bit(nx,ny,nz))
            normalBytes.extend(normalize8bit(nx,ny,nz))
        #normalmapFile.write('\n')
    #normalmapFile.write('\n')
    #normalmapFile.close()
    normalMap = Image.frombytes('RGB', (999,999), normalBytes.tobytes())
    flippedNormalMap = normalMap.transpose(Image.FLIP_TOP_BOTTOM)
    flippedNormalMap.save(dstTileFileprefix+".normal.png")


def normalize8bit(x,y,z):
    length=math.sqrt(x*x+y*y+z*z)
    nx = int(128+127*x/length)
    ny = int(128+127*y/length)
    nz = int(128+127*z/length)
    return (nx,ny,nz)


def readTile(filename):
    if("TM" in filename):
        return readTileTM(filename)
    else:
        return readTileGK(filename)

def readTileTM(filename):
    bigArray={}
    inputFile = open(filename,'r')
    for ix in range(0,1000):
        for iy in range(0,1000):
            line = inputFile.readline()
            bigArray[(ix,iy)]=line
    inputFile.close()
    return bigArray


"""The gauss kreuger version is more complicated because of the notes above."""
def readTileGK(filename):
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


    #keep track of the min and max integer coordinates for debugging
    ixmin = 9999999
    iymin = 9999999
    ixmax = 0
    iymax = 0


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
        #keep track of the min and max integer coordinates for debugging
        ixmin = min(ixmin, ix)
        iymin = min(iymin, iy)
        ixmax = max(ixmax, ix)
        iymax = max(iymax, iy)

        bigArray[(ix,iy)]=line

    print("read ", numlines, "lines")
    print("imin %d,%d" % (ixmin, iymin))
    print("imax %d,%d" % (ixmax, iymax))

    #output pbm file of keys which exist for visualization debugging
    # pbmfile = open(filename+".pbm", "w")
    # pbmfile.write("P1\n")
    # pbmfile.write("%d %d\n" % (ixmax-ixmin, iymax-iymin))
    # for iy in range(iymin,iymax):
    #     for ix in range(ixmin, ixmax):
    #         if (ix,iy) in bigArray:
    #             pbmfile.write("1")
    #         else:
    #             pbmfile.write("0")
    #     pbmfile.write("\n")
    # pbmfile.close()


    return bigArray


if __name__ == '__main__':
    import glob
    import os.path
    for srcTileFilename in glob.glob('rawdata/dem/96TM/*.asc'):
        tilex = int(srcTileFilename[-11:-8]) #eg. 403
        tiley = int(srcTileFilename[-7:-4]) #eg. 124
        dstTileFilenameHighRes = srcTileFilename.replace("rawdata", "assets").replace(".asc", "")+".1m.bin"

        #skip processing if the result file is already there. This allows us to add new raw tiles and 
        #reprocess without doing the whole lot again
        if not os.path.isfile(dstTileFilenameHighRes):
            processSingleAsciiTile(srcTileFilename)




