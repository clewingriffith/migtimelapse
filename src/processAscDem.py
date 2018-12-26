
import sys
import array
import math
""""
Takes a single file as an argument which is the ascii DEM format from slovenian LIDAR
the format is
x;y;alt\n
x;y;alt\n
There are 1million lines in each file, representing a 1000x1000 grid
"""
print(sys.argv[1])
inputFile = open(sys.argv[1],'r')

a1mArray = array.array('f')
a10mArray = array.array('f')
a100mArray = array.array('f')

valid100mIndices = [x*100000+y*100 for x in range(10) for y in range(10)]

valid10mIndices = [x*10000+y*10 for x in range(100) for y in range(100)]
#print(valid10mIndices)
def keyfunc(line):
    x,y,z=line.split(';')
    rx=round(float(x),1)
    ry=round(float(y),1)
    return (rx,ry)

pointsMap = {}

#The points in the .asc file are not actually arranged in a 1000x1000 grid.
#instead they appear to be in chunks 512 in the y(2nd coord) direction
#So we read the 4 subtiles in order, assembling them into a 1000x1000 array
#To get around this, we can sort by the x coordinate to bring all pieces together
#The y values should stay in order. We sort by the first 6 letters of the line
#as this is the integer x coordinate. Any more and we would find that
#changes in the decimal places screw up the ordering



xlboundaries = set()
ylboundaries = set()
xuboundaries = set()
yuboundaries = set()

# #try and detect the cut points in the tiles
numlines = 0
px=0
py=0
ix=0
iy=0

#lines=[]
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
print("numlines = ", numlines)
# print(xlboundaries)
# print(xuboundaries)
# print(ylboundaries)
# print(yuboundaries)
xmin=min(xlboundaries)
ymin=min(ylboundaries)

inputFile = open(sys.argv[1],'r')

iymax = numlines//1000
print (iymax)
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

# for ix in range(0,371):
#     for iy in range(0,512):
#         line = inputFile.readline()
#         bigArray[(ix,iy)]=(line)

# for ix in range(0,371):
#     for iy in range(512,iymax):
#         line = inputFile.readline()
#         bigArray[(ix,iy)]=(line)


# for ix in range(371,1000):
#     for iy in range(0,512):
#         line = inputFile.readline()
#         bigArray[(ix,iy)]=(line)

# #print(inputFile.readline())
# for ix in range(371,1000):
#     for iy in range(512,iymax):
#         line = inputFile.readline()
#         #print (line)
#         bigArray[(ix,iy)]=(line)

print(min(bigArray.keys()))
print(max(bigArray.keys()))

for ix in range(0,1000):
    for iy in range(0,1000):
        x,y,z = bigArray[(ix,iy)].split(';')
        a1mArray.append(float(x))
        a1mArray.append(float(y))
        a1mArray.append(float(z))
 
#print (inputFile.readline())


for idx in valid10mIndices:
    #print(a1mArray[3*idx],a1mArray[3*idx+1],a1mArray[3*idx+2])
    a10mArray.append(a1mArray[3*idx])
    a10mArray.append(a1mArray[3*idx+1])
    a10mArray.append(a1mArray[3*idx+2])

for idx in valid100mIndices:
    #print(a1mArray[3*idx],a1mArray[3*idx+1],a1mArray[3*idx+2])
    a100mArray.append(a1mArray[3*idx])
    a100mArray.append(a1mArray[3*idx+1])
    a100mArray.append(a1mArray[3*idx+2])


a1mOutputFile = open(sys.argv[1]+".1m.bin",'wb')
a1mOutputFile.write(a1mArray.tobytes())
a1mOutputFile.close()
a10mOutputFile = open(sys.argv[1]+".10m.bin",'wb')
a10mOutputFile.write(a10mArray.tobytes())
a10mOutputFile.close()
a100mOutputFile = open(sys.argv[1]+".100m.bin",'wb')
a100mOutputFile.write(a100mArray.tobytes())
a100mOutputFile.close()
