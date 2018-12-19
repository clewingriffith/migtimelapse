

export class SurveyStation {
    constructor(
        public x: number, 
        public y:number, 
        public z:number) {

    }
}

export class CaveSurvey {

    public surveyStations: SurveyStation[] = [];
    // takes a set of objects representing move, line, label commands from the 3d image format
    constructor(items: Object[]) {
        for(const item of items) {
            if(item['codetype'] === 'MOVE' || item['codetype'] === 'LINE') {
                this.surveyStations.push(new SurveyStation(item['x'], item['y'], item['z']));
            } 
        }
    }
}