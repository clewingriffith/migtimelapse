


For ($i=394; $i -le 415; $i++) {
  For ($j=116; $j -le 134; $j++) {
     if (!(Test-Path TM1_${i}_${j}.asc -PathType leaf)) {
        wget -o TM1_${i}_${j}.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_${i}_${j}.asc
     }
  }
}

#Obmocje 33
For ($i=394; $i -le 415; $i++) {
   For ($j=116; $j -le 123; $j++) {
      if (!(Test-Path TM1_${i}_${j}.asc -PathType leaf)) {
         wget -o TM1_${i}_${j}.asc http://gis.arso.gov.si/lidar/dmr1/b_33/D96TM/TM1_${i}_${j}.asc
      }
   }
 }

 
#wget -o TM1_403_121.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_403_121.asc
#wget -o TM1_403_121.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_403_121.asc
#wget -o TM1_403_121.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_403_121.asc
#wget -o TM1_403_121.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_403_121.asc


#wget -o TM1_403_125.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_403_125.asc
#wget -o TM1_404_124.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_404_124.asc
#wget -o TM1_404_125.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_404_125.asc
#wget -o TM1_405_124.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_405_124.asc
#wget -o TM1_405_125.asc http://gis.arso.gov.si/lidar/dmr1/b_37/D96TM/TM1_405_125.asc
