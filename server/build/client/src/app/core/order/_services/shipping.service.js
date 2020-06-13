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
const operators_1 = require("rxjs/operators");
// CRUD
const crud_1 = require("../../_base/crud");
const API_SHIPPING_URL = '/api/shipping/ongkir';
// Real REST API
let ShippingService = class ShippingService {
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'desc', '', 0, 10));
    }
    getDomain() {
        return this.httpUtils.domain + API_SHIPPING_URL;
    }
    // CREATE =>  POST: add a new shipping to the server
    createShipping(shipping) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(this.getDomain(), shipping, { headers: httpHeaders });
    }
    // READ
    getAllShippings() {
        return this.http.get(this.getDomain());
    }
    getShippingById(shippingId) {
        return this.http.get(this.getDomain() + `/${shippingId}`);
    }
    getShippingByorder(shippingId) {
        return this.http.get(this.getDomain() + `/order/${shippingId}`);
    }
    getDistrict(city, district) {
        const url = 'http://api.shipping.esoftplay.com/subdistrict/';
        return this.http.get(url + `${city}/${district}`);
    }
    // Server should return filtered/sorted result
    findShippings(queryParams) {
        // Note: Add headers if needed (tokens/bearer)
        return this.getAllShippings().pipe(operators_1.mergeMap(res => {
            const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
            return rxjs_1.of(result);
        }));
    }
    // UPDATE => PUT: update the shipping on the server
    updateShipping(shipping) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = shipping.id;
        const APi_URL = this.getDomain() + '/api/catalog/product/';
        return this.http.put(APi_URL + id, shipping, { headers: httpHeaders });
    }
    // DELETE => delete the shipping from the server
    deleteShipping(shippingId) {
        return this.http.delete(this.getDomain() + shippingId);
    }
    deleteShippings(ids = []) {
        const tasks$ = [];
        const length = ids.length;
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < length; i++) {
            tasks$.push(this.deleteShipping(ids[i]));
        }
        return rxjs_1.forkJoin(tasks$);
    }
};
ShippingService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ShippingService);
exports.ShippingService = ShippingService;
