"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Angular
const core_1 = require("@angular/core");
// RxJS
const rxjs_1 = require("rxjs");
// CRUD
const crud_1 = require("../../_base/crud");
const API_NOTIF_URL = '/api/order/notif/';
// Real REST API
let NotifService = class NotifService {
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'desc', '', 0, 10));
    }
    getDomain() {
        return this.httpUtils.domain + API_NOTIF_URL;
    }
    // READ
    getAllCheckoutNotif() {
        return this.http.get(this.getDomain());
    }
    // READ
    getAllConfirmNotif() {
        return this.http.get(this.getDomain() + 'confirm');
    }
};
NotifService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], NotifService);
exports.NotifService = NotifService;
