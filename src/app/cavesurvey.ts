//import { SSL_OP_NO_QUERY_MTU } from 'constants';


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
    public key() {
        return [this.x,this.y,this.z].toString()
    }
}

export class SurveyLeg {
    public explored;
    constructor(public date:Date, public survey:string, public flags:string[], public leg:SurveyStation[]) {
        this.explored=false;
        if(!flags) {
            this.flags=[];
        }
    }
    isUnderground():boolean {
        //ignore splay, above_ground and duplicate
        return this.flags === undefined || this.flags.length === 0; //.includes('ABOVE_GROUND') && this.leg[1].flags.includes('UNDERGROUND')
    }
    otherEnd(station: SurveyStation):SurveyStation {
        if(this.leg[0] === station) {
            return this.leg[1];
        } else {
            return this.leg[0];
        }
    }
    length():number {
        let dx=this.leg[1].x - this.leg[0].x;
        let dy=this.leg[1].y- this.leg[0].y;
        let dz=this.leg[1].z- this.leg[0].z;
        return Math.sqrt(dx*dx+dy*dy+dz*dz);
    }
}

export class CaveSurvey {

    public surveyStations = {};
    public surveyLegs: SurveyStation[][] = [];
    public surveyLegObjects: SurveyLeg[] = [];
    public legsBySurveyStation = {}
    public legsByDate: SurveyLeg[] = [];
    public legsByStationBySurvey = {} //dictionary keyed first by survey, then by station
    public legsBySurveyTree = {} //hierarchical version of legsByStationBySurvey
    // takes a set of objects representing move, line, label commands from the 3d image format
    constructor(items: Object[]) {
        var currentStationKey;
        var currentStationIndex = 0;
        var currentDate = null;
        var currentSurvey = null;
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
                if(item['label']) {
                    currentSurvey = item['label'];
                }
                const startStation = this.surveyStations[currentStationKey];
                const endStation = this.surveyStations[stationKey];

                this.surveyLegs.push([startStation, endStation]);
                var leg = new SurveyLeg(currentDate, currentSurvey, item['flags'], [startStation, endStation]);
                
                /*if(leg.isUnderground() === false) {
                    continue;
                }
                if(leg.length() > 100) {
                    console.log(leg);
                }*/
                this.surveyLegObjects.push(leg);
                this.storeLegByStation(leg, this.legsBySurveyStation);
                if(!this.legsByStationBySurvey[leg.survey]) {
                    this.legsByStationBySurvey[leg.survey]={};
                }
                this.storeLegByStation(leg, this.legsByStationBySurvey[leg.survey]);

                const surveyHierarchy = leg.survey.split(".");
                let surveySubtree = this.legsBySurveyTree;
                for(let level of surveyHierarchy) {
                    if(surveySubtree[level] === undefined) {
                        surveySubtree[level] = {}
                    }
                    surveySubtree =  surveySubtree[level]
                }
                this.storeLegByStation(leg, surveySubtree);

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
            if(item['codetype'] === 'DATE') {
                currentDate = item['date'];
                //console.log(currentDate);
            }
        }

        //Find entrances
        

        var entrances = Object.values(this.surveyStations).filter( 
            (s:SurveyStation) =>  { 
                return s.flags.includes('ENTRANCE') && s.flags.includes('UNDERGROUND');
            });
        var legsBySurveyStation = this.legsBySurveyStation;
        var entranceLegs = entrances.map( (e:SurveyStation) => {
            var connectedToEntrance = legsBySurveyStation[e.key()];
            return connectedToEntrance && connectedToEntrance.filter(function(l) {return l.isUnderground()});
        });
        //TODO: don't hardcode this
        //var startEntrance = entrances[8] as SurveyStation;

        //var startEntranceLeg = entranceLegs[8][0];
        var activeLimitOfExploration = null; //startEntrance;
        var limitsOfExploration = { };
        
        for(let e=0; e<entrances.length; e++) {
            if(entranceLegs[e]) {
                limitsOfExploration[(entrances[e] as SurveyStation).key()]=entranceLegs[e];
            }
        }
        //limitsOfExploration[startEntrance.key()]=[startEntranceLeg];
        var breaklimit = 10000;
        var i = 0;

        

        //var thisleg = startEntranceLeg;
        while(i<breaklimit) {
            i++;
            if(Object.keys(limitsOfExploration).length === 0) {
                break;
            }
            
            // Find the next active limit of exploration by looking at the limits and choosing the one
            // with the earliest date
            // Get all limit legs as flat array
            let limitLegs:SurveyLeg[] = [].concat.apply([], Object.values(limitsOfExploration));
            limitLegs.sort( (a,b) => {
                if(!b.date) {
                    return -1;
                } 
                if(a.date) { 
                    return a.date.getTime() - b.date.getTime(); 
                } 
                return 1;
            });
            let earliestLeg = limitLegs[0];
            
            for(let key in limitsOfExploration) {
                    if(limitsOfExploration[key].includes(earliestLeg)) {
                        activeLimitOfExploration = this.surveyStations[key];
                    }
                }
            //act as a pop operation. We get it back in the return value of exploreSurvey
            delete limitsOfExploration[activeLimitOfExploration.key()];
            let newlimits = this.exploreSurvey(earliestLeg.survey, activeLimitOfExploration);
            //take the newly discovered limits of exploration, find out the connecting legs, and put them back
            //on the stack
            for(let limit of newlimits) {
                var legsConnectingLimitOfExploration=legsBySurveyStation[limit.key()];
                if(legsConnectingLimitOfExploration) {
                    var unexploredLegsConnectingLimitOfExploration=legsConnectingLimitOfExploration.filter(l => l.explored === false);
                    if(unexploredLegsConnectingLimitOfExploration.length>0) {
                        limitsOfExploration[limit.key()]=unexploredLegsConnectingLimitOfExploration;
                    } else {
                        //delete limitsOfExploration[activeLimitOfExploration.key()];
                        //activeLimitOfExploration=null;
                        continue;
                    }
                }
            }

           /* if(unexploredLegsConnectingLimitOfExploration.length === 1) {
                //proceed to end of leg
                let thisleg=unexploredLegsConnectingLimitOfExploration[0];
                thisleg.explored = true;
                this.legsByDate.push(thisleg);
                //replace this limit with the next one
                delete limitsOfExploration[activeLimitOfExploration.key()];
                activeLimitOfExploration = thisleg.otherEnd(activeLimitOfExploration);
                limitsOfExploration[activeLimitOfExploration.key()]= legsBySurveyStation[activeLimitOfExploration.key()].filter(l => l.explored === false);
                continue;                
            }
*/
            // nextleg is an array, normally of two legs -- the current one and the nextleg

        }
        console.log("entrances: "+entrances);

    }

    exploreSurvey(surveyName:string, station: SurveyStation):SurveyStation[] {
        const byStation = this.legsByStationBySurvey[surveyName];
        let limits = [station]; // a stack of exploration limits. 
        let exportedLimits = [station]; //always put the start station back in case there are other surveys from this station
        while(limits.length>0) {
            let thislimit = limits.pop();
            let legs=byStation[thislimit.key()];
            if(legs.length === 0) {
                continue;
            }
            let thisleg:SurveyLeg = legs.pop();

            if(legs.length > 0) {
                // if there are any other legs connected to the limit of exploration, put this limit back on the 
                // stack so we can come back to it
                limits.push(thislimit);
            }
            //console.log('exploring '+thisleg.survey);
            this.legsByDate.push(thisleg);
            thisleg.explored = true; // we may not need this if removal works
            //remove it from the map so we don't see it again. It has already been taken out of consideration for this station
            //but needs to be removed from the other end too
            let otherEnd:SurveyStation = thisleg.otherEnd(thislimit);
            let withThisLeg = byStation[otherEnd.key()]
            let withoutThisLeg = withThisLeg.filter(l => l !== thisleg);
            
            byStation[otherEnd.key()]=withoutThisLeg;
            //extend limits to ends of all the legs connecting the limit of exploration
            //for(let leg of legs) {
            
                limits.push(thisleg.otherEnd(thislimit));
                if(otherEnd.flags.includes("EXPORT")) {
                    exportedLimits.push(otherEnd);
                }
            //}
        }
        return exportedLimits;
    }

    //store a survey leg into a dictionary, keyed by the station coordinates
    storeLegByStation(leg:SurveyLeg, dict) {
        for(let station of leg.leg) {
            const stationKey = station.key();
            if(!dict[stationKey]) {
                dict[stationKey]=[];
            }
            dict[stationKey].push(leg);
        }
    }

}