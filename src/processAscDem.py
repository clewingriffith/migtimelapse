
import sys
import array

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
print(valid10mIndices)

#The points in the .asc file are not actually arranged in a 1000x1000 grid.
#instead they appear to be in chunks 512 in the y(2nd coord) direction
#To get around this, we can sort by the x coordinate to bring all pieces together
#The y values should stay in order. We sort by the first 6 letters of the line
#as this is the integer x coordinate. Any more and we would find that
#changes in the decimal places screw up the ordering
for idx,line in enumerate(sorted(inputFile.readlines(), key=lambda l:l[0:6])):
    x,y,z=line.split(';')
    a1mArray.append(float(x))
    a1mArray.append(float(z)) #deliberatly the wrong way round because y is up
    a1mArray.append(float(y))

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
