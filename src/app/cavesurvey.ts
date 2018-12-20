

export class SurveyStation {
    public labels: string[];
    public flags: string[];
    public i: number;
    public x: number;   
    public y: number;
    public z: number;
    constructor(
        i: number,
        x: number, 
        y:number, 
        z:number) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.z = z;
        this.labels = [];
        this.flags = [];
    }
}

export class CaveSurvey {

    public surveyStations = {};
    public surveyLegs: SurveyStation[][] = [];
    // takes a set of objects representing move, line, label commands from the 3d image format
    constructor(items: Object[]) {
        var currentStationKey;
        var currentStationIndex = 0;
        for(const item of items) {
            //TODO filter out service survey legs
            if(item['codetype'] === 'MOVE') {
                const x:number = item['x'];
                const y:number = item['y'];
                const z:number = item['z'];
                const stationKey = [x,y,z].toString();
                if(this.surveyStations[stationKey] === undefined) {
                    this.surveyStations[stationKey] = new SurveyStation(currentStationIndex++, item['x'], item['y'], item['z']);
                }
                currentStationKey = stationKey;
            } 
            if(item['codetype'] === 'LINE') {
                const x:number = item['x'];
                const y:number = item['y'];
                const z:number = item['z'];
                const stationKey = [x,y,z].toString();
                if(this.surveyStations[stationKey] === undefined) {
                    this.surveyStations[stationKey] = new SurveyStation(currentStationIndex++,item['x'], item['y'], item['z']);
                }
                const startStation = this.surveyStations[currentStationKey];
                const endStation = this.surveyStations[stationKey];
                this.surveyLegs.push([startStation, endStation]);
                currentStationKey = stationKey;
            }
            if(item['codetype'] === 'LABEL') {
                const x:number = item['x'];
                const y:number = item['y'];
                const z:number = item['z'];
                const stationKey = [x,y,z].toString();
                if(this.surveyStations[stationKey] === undefined) {
                    const newStation = new SurveyStation(currentStationIndex++,item['x'], item['y'], item['z']);
                    newStation.labels.push(item['label']);
                    newStation.flags = item['flags'];
                    this.surveyStations[stationKey] = newStation;
                } else {
                    this.surveyStations[stationKey].labels.push(item['label']);
                    this.surveyStations[stationKey].flags = this.surveyStations[stationKey].flags.concat(item['flags']);
                }
            }
        }
    }
}