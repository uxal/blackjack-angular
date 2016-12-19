/**
 * Created by dragos on 16/12/2016.
 * I use this to be able to simulate a for i=0; i<x; i++ with *ngFor in lobby.component.html
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ForNumberPipe = (function () {
    function ForNumberPipe() {
    }
    ForNumberPipe.prototype.transform = function (value, args) {
        var res = [];
        for (var i = 0; i < value; i++) {
            res.push(i);
        }
        return res;
    };
    ForNumberPipe = __decorate([
        core_1.Pipe({ name: 'forNumber' }), 
        __metadata('design:paramtypes', [])
    ], ForNumberPipe);
    return ForNumberPipe;
}());
exports.ForNumberPipe = ForNumberPipe;
//# sourceMappingURL=for-number.pipe.js.map