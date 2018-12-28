(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<app-world></app-world>\n\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'survex3dformat';
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _world_world_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./world/world.component */ "./src/app/world/world.component.ts");
/* harmony import */ var _caveloader_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./caveloader.service */ "./src/app/caveloader.service.ts");
/* harmony import */ var _demloader_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./demloader.service */ "./src/app/demloader.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _world_world_component__WEBPACK_IMPORTED_MODULE_4__["WorldComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"]
            ],
            providers: [_caveloader_service__WEBPACK_IMPORTED_MODULE_5__["CaveLoaderService"], _demloader_service__WEBPACK_IMPORTED_MODULE_6__["DEMLoaderService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/caveloader.service.ts":
/*!***************************************!*\
  !*** ./src/app/caveloader.service.ts ***!
  \***************************************/
/*! exports provided: CaveLoaderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaveLoaderService", function() { return CaveLoaderService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CaveLoaderService = /** @class */ (function () {
    function CaveLoaderService(http) {
        this.http = http;
        this.labelBuffer = '';
        //Add on a function for reading a string terminated by an arbitrary character.
        //This code is copied from datastream.js  readCString, but replacing the 
        //hardcoded '0' terminator with a value that can be passed in.
        //We use it for reading strings terminated by '\n', where we pass terminator=0x0a
        DataStream.prototype.readTerminatedString = function (terminator, length) {
            var blen = this.byteLength - this.position;
            var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
            var len = blen;
            if (length != null) {
                len = Math.min(length, blen);
            }
            for (var i = 0; i < len && u8[i] != terminator; i++)
                ; // find first terminator byte (eg. 0 or 0x0a)
            var s = DataStream.createStringFromArray(this.mapUint8Array(i));
            if (length != null) {
                this.position += len - i;
            }
            else if (i != blen) {
                this.position += 1; // trailing zero if not at end of buffer
            }
            return s;
        };
    }
    CaveLoaderService.prototype.readHeader = function (stream) {
        var expectedHeaderStr = "Survex 3D Image File\n";
        var headerStr = stream.readString(expectedHeaderStr.length);
        if (headerStr !== expectedHeaderStr) {
            throw new Error('Could not find Survex 3D Image File header');
        }
        var expectedVersionString = "v8\n";
        var versionStr = stream.readString(expectedVersionString.length);
        if (versionStr !== expectedVersionString) {
            throw new Error('Version does not match v8. Cannot parse');
        }
        var metadata = stream.readTerminatedString(0x0a);
        console.log('Survey metatdata: ' + metadata);
        var timestampStr = stream.readTerminatedString(0x0a);
        if (timestampStr.startsWith('@') == false) {
            throw new Error('unexpected timestamp string');
        }
        //strip the @ and interpret as a timestamp
        var epochSeconds = parseInt(timestampStr.substr(1));
        var timestamp = new Date(epochSeconds * 1000);
        console.log(timestamp);
        var filewideFlags = stream.readUint8();
        return {
            fileId: headerStr,
            version: versionStr,
            metadata: metadata,
            timestamp: timestamp,
            filewideFlags: filewideFlags
        };
    };
    CaveLoaderService.prototype.readLabel = function (stream) {
        var b = stream.readUint8();
        var D;
        var A;
        if (b > 0) {
            D = b >> 4;
            A = b & 0x0f;
        }
        else {
            b = stream.readUint8();
            if (b != 0xff) {
                D = b;
            }
            else {
                D = stream.readUint32();
            }
            b = stream.readUint8();
            if (b != 0xff) {
                A = b;
            }
            else {
                A = stream.readUint32();
            }
        }
        var labelMod = stream.readString(A);
        if (D !== 0) {
            this.labelBuffer = this.labelBuffer.slice(0, -D);
        }
        this.labelBuffer = this.labelBuffer + labelMod;
        return this.labelBuffer;
    };
    CaveLoaderService.prototype.readLRUDInt16 = function (stream) {
        var val = stream.readInt16();
        if (val == 0xffff) {
            return null;
        }
        else {
            return 0.01 * parseInt(val);
        }
    };
    CaveLoaderService.prototype.readLRUDInt32 = function (stream) {
        var val = stream.readInt32();
        if (val == 0xffffffff) {
            return null;
        }
        else {
            return 0.01 * parseInt(val);
        }
    };
    // copied from the survex codebase
    CaveLoaderService.prototype.is_leap_year = function (year) {
        return (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
    };
    // copied from the survex codebase
    CaveLoaderService.prototype.ymd_from_days_since_1900 = function (days) {
        var g, dg, c, dc, b, db, a, da, y, m;
        days += 693901;
        g = Math.trunc(days / 146097);
        dg = days % 146097;
        c = Math.trunc((Math.trunc(dg / 36524) + 1) * 3 / 4);
        dc = dg - c * 36524;
        b = Math.trunc(dc / 1461);
        db = dc % 1461;
        a = Math.trunc((Math.trunc(db / 365) + 1) * 3 / 4);
        da = db - a * 365;
        y = g * 400 + c * 100 + b * 4 + a;
        m = Math.trunc((da * 5 + 308) / 153);
        return [
            y + Math.trunc(m / 12),
            m % 12 + 1,
            da - Math.trunc((m + 2) * 153 / 5) + 123
        ];
    };
    CaveLoaderService.prototype.date_from_days_since_1900 = function (days) {
        var ymd = this.ymd_from_days_since_1900(days);
        return new Date(ymd[0], ymd[1] - 1, ymd[2]);
    };
    CaveLoaderService.prototype.readItem = function (stream) {
        var code = stream.readUint8();
        var item = {};
        if (code == 0x00) {
            if (this.style === 'STYLE_NORMAL') {
                item['codetype'] = 'STOP';
            }
            else {
                item['codetype'] = 'STYLE_NORMAL';
                this.style = 'STYLE_NORMAL';
            }
        }
        else if (code == 0x01) {
            item['codetype'] = 'STYLE_DIVING';
            this.style = 'STYLE_DIVING';
        }
        else if (code == 0x02) {
            item['codetype'] = 'STYLE_CARTESIAN';
            this.style = 'STYLE_CARTESIAN';
        }
        else if (code == 0x03) {
            item['codetype'] = 'STYLE_CYLPOLAR';
            this.style = 'STYLE_CYLPOLAR';
        }
        else if (code == 0x04) {
            item['codetype'] = 'STYLE_NOSURVEY';
            this.style = 'STYLE_NOSURVEY';
        }
        else if (code == 0x0f) {
            item['codetype'] = 'MOVE';
            item['x'] = this.getCM(stream);
            item['y'] = this.getCM(stream);
            item['z'] = this.getCM(stream);
        }
        else if (code == 0x10) {
            item['codetype'] = 'DATE';
        }
        else if (code == 0x11) {
            item['codetype'] = 'DATE';
            var daysSince1900 = stream.readUint16();
            item['date'] = this.date_from_days_since_1900(daysSince1900);
        }
        else if (code == 0x12) {
            item['codetype'] = 'DATE';
            var daysSince1900 = stream.readUint16();
            var dayspan = stream.readUint8();
            var daysSince1900_2 = daysSince1900 + dayspan;
            var date1 = this.date_from_days_since_1900(daysSince1900);
            var date2 = this.date_from_days_since_1900(daysSince1900_2);
            item['date'] = date1;
            item['dates'] = [date1, date2];
        }
        else if (code == 0x13) {
            item['codetype'] = 'DATE';
            var daysSince1900 = stream.readUint16();
            var daysSince1900_2 = stream.readUint16();
            var date1 = this.date_from_days_since_1900(daysSince1900);
            var date2 = this.date_from_days_since_1900(daysSince1900_2);
            item['date'] = date1;
            item['dates'] = [date1, date2];
        }
        else if (code == 0x1f) {
            item['codetype'] = 'ERROR';
            var legs = stream.readInt32();
            var length_1 = 0.01 * parseInt(stream.readInt32());
            var e = 0.01 * parseInt(stream.readInt32());
            var h = 0.01 * parseInt(stream.readInt32());
            var v = 0.01 * parseInt(stream.readInt32());
            item['error'] = { legs: legs, length: length_1, e: e, h: h, v: v };
        }
        else if (code >= 0x30 && code <= 0x31) {
            item['codetype'] = 'XSECT';
            item['label'] = this.readLabel(stream);
            item['l'] = this.readLRUDInt16(stream);
            item['r'] = this.readLRUDInt16(stream);
            item['u'] = this.readLRUDInt16(stream);
            item['d'] = this.readLRUDInt16(stream);
            var flag = (code & 0x01);
            if (flag & 0x01) {
                item['flag'] = 'LAST_IN_PASSAGE';
            }
        }
        else if (code >= 0x32 && code <= 0x33) {
            item['codetype'] = 'XSECT';
            item['label'] = this.readLabel(stream);
            item['l'] = this.readLRUDInt32(stream);
            item['r'] = this.readLRUDInt32(stream);
            item['u'] = this.readLRUDInt32(stream);
            item['d'] = this.readLRUDInt32(stream);
            var flag = (code & 0x01);
            if (flag & 0x01) {
                item['flag'] = 'LAST_IN_PASSAGE';
            }
        }
        else if (code >= 0x40 && code <= 0x7f) {
            item['codetype'] = 'LINE';
            var flag = (code & 0x3f);
            if (flag) {
                item['flags'] = [];
            }
            if (flag & 0x01) {
                item['flags'].push('ABOVE_GROUND');
            }
            if (flag & 0x02) {
                item['flags'].push('DUPLICATE');
            }
            if (flag & 0x04) {
                item['flags'].push('SPLAY');
            }
            if (flag & 0x20) {
                // omit label
            }
            else {
                item['label'] = this.readLabel(stream);
            }
            item['x'] = this.getCM(stream);
            item['y'] = this.getCM(stream);
            item['z'] = this.getCM(stream);
        }
        else if (code >= 0x80 && code <= 0xff) {
            item['codetype'] = 'LABEL';
            item['label'] = this.readLabel(stream);
            item['x'] = this.getCM(stream);
            item['y'] = this.getCM(stream);
            item['z'] = this.getCM(stream);
            var flag = (code & 0x7f);
            if (flag) {
                item['flags'] = [];
            }
            if (flag & 0x01) {
                item['flags'].push('ABOVE_GROUND');
            }
            if (flag & 0x02) {
                item['flags'].push('UNDERGROUND');
            }
            if (flag & 0x04) {
                item['flags'].push('ENTRANCE');
            }
            if (flag & 0x08) {
                item['flags'].push('EXPORT');
            }
            if (flag & 0x10) {
                item['flags'].push('FIXED');
            }
            if (flag & 0x20) {
                item['flags'].push('ANONYMOUS');
            }
            if (flag & 0x40) {
                item['flags'].push('PASSAGE_WALL');
            }
        }
        else {
            // console.log('unknown code' + code);
        }
        return item;
    };
    CaveLoaderService.prototype.getCM = function (stream) {
        return parseFloat((0.01 * parseInt(stream.readInt32())).toFixed(2));
    };
    CaveLoaderService.prototype.read3dFile = function () {
        var _this = this;
        //This attempts to parse survex 3d image files as specified at 
        //https://survex.com/docs/3dformat.htm
        //It currently only handles version 8
        return this.http.get('assets/mig.3d', { responseType: 'arraybuffer' }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (data) {
            var stream = new DataStream(data, 0, DataStream.LITTLE_ENDIAN);
            var header = _this.readHeader(stream);
            console.log(header);
            var items = [];
            while (stream.isEof() == false) {
                var item = _this.readItem(stream);
                items.push(item); // console.log(item);
            }
            return items;
        }));
    };
    CaveLoaderService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], CaveLoaderService);
    return CaveLoaderService;
}());



/***/ }),

/***/ "./src/app/cavesurvey.ts":
/*!*******************************!*\
  !*** ./src/app/cavesurvey.ts ***!
  \*******************************/
/*! exports provided: SurveyStation, CaveSurvey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyStation", function() { return SurveyStation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaveSurvey", function() { return CaveSurvey; });
var SurveyStation = /** @class */ (function () {
    function SurveyStation(i, x, y, z) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.z = z;
        this.labels = [];
        this.flags = [];
    }
    return SurveyStation;
}());

var CaveSurvey = /** @class */ (function () {
    // takes a set of objects representing move, line, label commands from the 3d image format
    function CaveSurvey(items) {
        this.surveyStations = {};
        this.surveyLegs = [];
        var currentStationKey;
        var currentStationIndex = 0;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            //TODO filter out service survey legs
            if (item['codetype'] === 'MOVE') {
                var x = item['x'];
                var y = item['y'];
                var z = item['z'];
                var stationKey = [x, y, z].toString();
                if (this.surveyStations[stationKey] === undefined) {
                    this.surveyStations[stationKey] = new SurveyStation(currentStationIndex++, item['x'], item['y'], item['z']);
                }
                currentStationKey = stationKey;
            }
            if (item['codetype'] === 'LINE') {
                var x = item['x'];
                var y = item['y'];
                var z = item['z'];
                var stationKey = [x, y, z].toString();
                if (this.surveyStations[stationKey] === undefined) {
                    this.surveyStations[stationKey] = new SurveyStation(currentStationIndex++, item['x'], item['y'], item['z']);
                }
                var startStation = this.surveyStations[currentStationKey];
                var endStation = this.surveyStations[stationKey];
                this.surveyLegs.push([startStation, endStation]);
                currentStationKey = stationKey;
            }
            if (item['codetype'] === 'LABEL') {
                var x = item['x'];
                var y = item['y'];
                var z = item['z'];
                var stationKey = [x, y, z].toString();
                if (this.surveyStations[stationKey] === undefined) {
                    var newStation = new SurveyStation(currentStationIndex++, item['x'], item['y'], item['z']);
                    newStation.labels.push(item['label']);
                    newStation.flags = item['flags'];
                    this.surveyStations[stationKey] = newStation;
                }
                else {
                    this.surveyStations[stationKey].labels.push(item['label']);
                    this.surveyStations[stationKey].flags = this.surveyStations[stationKey].flags.concat(item['flags']);
                }
            }
        }
    }
    return CaveSurvey;
}());



/***/ }),

/***/ "./src/app/demloader.service.ts":
/*!**************************************!*\
  !*** ./src/app/demloader.service.ts ***!
  \**************************************/
/*! exports provided: DEMLoaderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEMLoaderService", function() { return DEMLoaderService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DEMLoaderService = /** @class */ (function () {
    function DEMLoaderService(http) {
        this.http = http;
    }
    DEMLoaderService.prototype.readDEMData = function (tile, resolution) {
        //This parses a .asc.bin as preprocessed by a python script in this project
        //processAscDem.py
        //input data to that script is a .asc file from http://gis.arso.gov.si/evode/profile.aspx?id=atlas_voda_Lidar@Arso&culture=en-US
        return this.http.get('assets/dem/GK1_' + tile + '.asc.' + resolution + 'm.bin', { responseType: 'arraybuffer' });
    };
    DEMLoaderService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], DEMLoaderService);
    return DEMLoaderService;
}());



/***/ }),

/***/ "./src/app/world/world.component.css":
/*!*******************************************!*\
  !*** ./src/app/world/world.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "canvas {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n"

/***/ }),

/***/ "./src/app/world/world.component.html":
/*!********************************************!*\
  !*** ./src/app/world/world.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<canvas #canvas (window:resize)=\"onResize($event)\"></canvas>\n"

/***/ }),

/***/ "./src/app/world/world.component.ts":
/*!******************************************!*\
  !*** ./src/app/world/world.component.ts ***!
  \******************************************/
/*! exports provided: WorldComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorldComponent", function() { return WorldComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_orbitcontrols_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three-orbitcontrols-ts */ "./node_modules/three-orbitcontrols-ts/dist/index.js");
/* harmony import */ var three_orbitcontrols_ts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(three_orbitcontrols_ts__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _caveloader_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../caveloader.service */ "./src/app/caveloader.service.ts");
/* harmony import */ var _demloader_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../demloader.service */ "./src/app/demloader.service.ts");
/* harmony import */ var _cavesurvey__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cavesurvey */ "./src/app/cavesurvey.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var WorldComponent = /** @class */ (function () {
    function WorldComponent(caveloader, demloader) {
        this.caveloader = caveloader;
        this.demloader = demloader;
        this.vertices = [];
        this.numLegsToDisplay = 0;
        this.rotationSpeedX = 0.005;
        this.rotationSpeedY = 0.01;
        this.size = 20;
        /* STAGE PROPERTIES */
        this.cameraZ = 40;
        this.fieldOfView = 70;
        this.nearClippingPane = 1;
        this.farClippingPane = 100000;
    }
    Object.defineProperty(WorldComponent.prototype, "canvas", {
        get: function () {
            return this.canvasRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    /* STAGING, ANIMATION, AND RENDERING */
    /**
     * Animate the cave survey, drawing progressively more survey legs
     */
    WorldComponent.prototype.animateSurvey = function () {
        this.numLegsToDisplay += 10;
        this.numLegsToDisplay = Math.min(this.numLegsToDisplay, this.survey.surveyLegs.length);
        var geo = this.legs.geometry;
        geo.setDrawRange(0, this.numLegsToDisplay);
        this.controls.update();
        //console.log(this.controls.getAzimuthalAngle())
    };
    // pass a tile name like 404_123
    // This reads the dem data for the tile and creates geometry for it.
    // it also loads appropriate texture information
    // resolution should be 1 for 1m resolution, 10 for 10m resolution, 100 for 100m resolution
    WorldComponent.prototype.createMountainPointcloud = function (tile, resolution) {
        var _this = this;
        this.demloader.readDEMData(tile, resolution).subscribe(function (arraybuffer) {
            var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["BufferGeometry"]();
            //const geometry = new THREE.PlaneBufferGeometry(1000,1000,99,99);
            var demPointArray = new Float32Array(arraybuffer);
            var texture = new three__WEBPACK_IMPORTED_MODULE_1__["TextureLoader"]().load('assets/satellite/' + tile + '.jpg');
            var grid_width = 1 + (1000 / resolution);
            //build out indices for mesh version
            var indices = [];
            var uvs = [];
            var normals = [];
            var ix;
            var iy;
            var gridX = grid_width - 1;
            var gridY = grid_width - 1;
            var gridX1 = gridX + 1;
            var gridY1 = gridY + 1;
            for (iy = 0; iy < gridY; iy++) {
                for (ix = 0; ix < gridX; ix++) {
                    var a = ix + gridX1 * iy;
                    var b = ix + gridX1 * (iy + 1);
                    var c = (ix + 1) + gridX1 * (iy + 1);
                    var d = (ix + 1) + gridX1 * iy;
                    // faces
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
            var segment_width = 1000 / gridX;
            var segment_height = 1000 / gridY;
            var width_half = 500;
            var height_half = 500;
            for (iy = 0; iy < gridY1; iy++) {
                var y = iy * segment_height - height_half;
                for (ix = 0; ix < gridX1; ix++) {
                    var x = ix * segment_width - width_half;
                    uvs.push((iy / gridY));
                    uvs.push(ix / gridX);
                }
            }
            //indices.push(0,1,100);
            geometry.setIndex(indices);
            geometry.addAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__["BufferAttribute"](demPointArray, 3));
            geometry.addAttribute('uv', new three__WEBPACK_IMPORTED_MODULE_1__["Float32BufferAttribute"](uvs, 2));
            geometry.computeVertexNormals();
            var demMaterial = new three__WEBPACK_IMPORTED_MODULE_1__["PointsMaterial"]({ color: 0x888888 });
            _this.demMeshMaterial = new three__WEBPACK_IMPORTED_MODULE_1__["MeshLambertMaterial"]({ color: 0xcccccc, map: texture, wireframe: false });
            var mesh = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, _this.demMeshMaterial);
            var demPointCloud = new three__WEBPACK_IMPORTED_MODULE_1__["Points"](geometry, demMaterial);
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
            //this.scene.add(demPointCloud);
            //    //this.demPointCloud = new THREE.Points( geometry, demMaterial );
            _this.group.add(mesh);
        });
    };
    WorldComponent.prototype.createGeometry = function () {
        var _this = this;
        this.caveloader.read3dFile().subscribe(function (fileItems) {
            _this.survey = new _cavesurvey__WEBPACK_IMPORTED_MODULE_5__["CaveSurvey"](fileItems);
            // let texture = new THREE.TextureLoader().load(this.texture);
            //var material = new THREE.PointsMaterial( { color: 0xffffff } );
            var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({
                color: 0xffffff,
                linewidth: 40
            });
            var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["BufferGeometry"]();
            var surveyStations;
            //Don't blindly push the stations. Some of them are fixed points with incorrect locations
            surveyStations = Object.values(_this.survey.surveyStations);
            surveyStations.forEach(function (station) {
                //if(station.flags.includes("UNDERGROUND")) {
                _this.vertices.push(station.x, station.y, station.z);
                //}
            });
            var legIndices = [];
            _this.survey.surveyLegs.forEach(function (leg) {
                if (leg[0].flags.includes('UNDERGROUND') || leg[1].flags.includes('UNDERGROUND')) {
                    legIndices.push(leg[0].i);
                    legIndices.push(leg[1].i);
                }
            });
            var vertexArray = new Float32Array(_this.vertices);
            // itemSize = 3 because there are 3 values (components) per vertex
            geometry.setIndex(legIndices);
            geometry.addAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__["BufferAttribute"](vertexArray, 3));
            geometry.computeBoundingSphere();
            geometry.computeBoundingBox();
            //const c = geometry.boundingSphere.center;
            //console.log(c);
            //test center of non-indexed version
            var nonindexed = geometry.toNonIndexed();
            nonindexed.computeBoundingSphere();
            var c = nonindexed.boundingSphere.center;
            //geometry.translate(c.x, c.y, c.z);
            //geometry.scale(0.1, 0.1, 0.1);
            // geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
            _this.legs = new three__WEBPACK_IMPORTED_MODULE_1__["LineSegments"](nonindexed, material);
            // Add cube to scene
            _this.group.add(_this.legs);
            //var box = new THREE.BoxHelper(this.legs, new THREE.Color('red'));
            //this.group.add(box);
            _this.camera.position.set(c.x, c.y, c.z + nonindexed.boundingSphere.radius);
            _this.camera.up.set(0, 0, 1);
            _this.camera.lookAt(c.x, c.y, c.z);
            _this.controls.target = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](c.x, c.y, c.z);
            //this.controls.maxAzimuthAngle = Math.PI / 4;
            //this.controls.minAzimuthAngle = 0;
            /* this.controls.maxAzimuthAngle=Math.PI;
             this.controls.minAzimuthAngle=Math.PI-1;
             this.controls.maxPolarAngle=Math.PI;
             this.controls.minPolarAngle=0;*/
            _this.controls.update();
            _this.startRenderingLoop();
        });
    };
    /**
     * Create the scene
     */
    WorldComponent.prototype.createScene = function () {
        /* Scene */
        three__WEBPACK_IMPORTED_MODULE_1__["Object3D"].DefaultUp = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](0, 0, 1);
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__["Scene"]();
        this.group = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
        //this.group.rotation.x = -Math.PI / 2;
        this.scene.add(this.group);
        /* Camera */
        var aspectRatio = this.getAspectRatio();
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__["PerspectiveCamera"](this.fieldOfView, aspectRatio, this.nearClippingPane, this.farClippingPane);
        this.controls = new three_orbitcontrols_ts__WEBPACK_IMPORTED_MODULE_2__["OrbitControls"](this.camera);
        this.controls.autoRotate = true;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.autoRotateSpeed = 4.0;
        //this.camera.position.z = this.cameraZ;
        /*var axisHelper = new THREE.AxesHelper(2000);
        axisHelper.position.set(404000,123000,0);
        this.group.add(axisHelper);*/
        var skylight = new three__WEBPACK_IMPORTED_MODULE_1__["HemisphereLight"](0xffffbb, 0x080820, 0.2);
        this.group.add(skylight);
        var sunLight = new three__WEBPACK_IMPORTED_MODULE_1__["DirectionalLight"](0xffffff, 0.8);
        this.group.add(sunLight);
    };
    WorldComponent.prototype.getAspectRatio = function () {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    };
    /**
     * Start the rendering loop
     */
    WorldComponent.prototype.startRenderingLoop = function () {
        /* Renderer */
        // Use canvas element in template
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__["WebGLRenderer"]({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        var component = this;
        (function render() {
            requestAnimationFrame(render);
            component.animateSurvey();
            component.renderer.render(component.scene, component.camera);
        }());
    };
    /* EVENTS */
    /**
     * Update scene after resizing.
     */
    WorldComponent.prototype.onResize = function () {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    };
    /* LIFECYCLE */
    /**
     * We need to wait until template is bound to DOM, as we need the view
     * dimensions to create the scene. We could create the cube in a Init hook,
     * but we would be unable to add it to the scene until now.
     */
    WorldComponent.prototype.ngAfterViewInit = function () {
        this.createScene();
        this.createMountainPointcloud("403_121", 10);
        this.createMountainPointcloud("403_122", 10);
        this.createMountainPointcloud("403_123", 10);
        this.createMountainPointcloud("403_124", 10);
        this.createMountainPointcloud("404_121", 10);
        this.createMountainPointcloud("404_122", 10); //1
        this.createMountainPointcloud("404_123", 10); //1
        this.createMountainPointcloud("404_124", 10); //1
        this.createMountainPointcloud("405_121", 10);
        this.createMountainPointcloud("405_122", 10);
        this.createMountainPointcloud("405_123", 10); //1
        this.createMountainPointcloud("405_124", 10); //1
        //this.createMountainPointcloud("406_122", 1);
        //this.createMountainPointcloud("406_123", 1);
        //this.createMountainPointcloud("406_124", 1);
        this.createGeometry();
        //this.startRenderingLoop();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('canvas'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], WorldComponent.prototype, "canvasRef", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], WorldComponent.prototype, "size", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], WorldComponent.prototype, "cameraZ", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], WorldComponent.prototype, "fieldOfView", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('nearClipping'),
        __metadata("design:type", Number)
    ], WorldComponent.prototype, "nearClippingPane", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])('farClipping'),
        __metadata("design:type", Number)
    ], WorldComponent.prototype, "farClippingPane", void 0);
    WorldComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-world',
            template: __webpack_require__(/*! ./world.component.html */ "./src/app/world/world.component.html"),
            styles: [__webpack_require__(/*! ./world.component.css */ "./src/app/world/world.component.css")]
        }),
        __metadata("design:paramtypes", [_caveloader_service__WEBPACK_IMPORTED_MODULE_3__["CaveLoaderService"], _demloader_service__WEBPACK_IMPORTED_MODULE_4__["DEMLoaderService"]])
    ], WorldComponent);
    return WorldComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\clewin\Documents\Clewin\migtimelapse\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map