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
const API_DELIVERY_URL = '/api/order/delivery/';
// Real REST API
let DeliveryService = class DeliveryService {
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'desc', '', 0, 10));
    }
    getDomain() {
        return this.httpUtils.domain + API_DELIVERY_URL;
    }
    // CREATE =>  POST: add a new delivery to the server
    createDelivery(delivery) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        // console.log(delivery);
        return this.http.post(this.getDomain(), delivery, { headers: httpHeaders });
    }
    // READ
    getAllDeliverys() {
        // console.log(this.idOrder);
        return this.http.get(this.httpUtils.domain + `/api/order/orders/detailOrder/${this.idOrder}`);
    }
    getDeliveryById(deliveryId) {
        return this.http.get(this.getDomain() + `${deliveryId}`);
    }
    getDeliveryByOrder(orderId) {
        return this.http.get(this.getDomain() + `order/${orderId}`);
    }
    // Server should return filtered/sorted result
    findDeliverys(queryParams) {
        // Note: Add headers if needed (tokens/bearer)
        return this.getAllDeliverys().pipe(operators_1.mergeMap(res => {
            const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
            return rxjs_1.of(result);
        }));
    }
    // UPDATE => PUT: update the delivery on the server
    updateDelivery(delivery) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = delivery.id;
        return this.http.put(this.getDomain() + `done/${id}`, delivery, { headers: httpHeaders });
    }
    // DELETE => delete the delivery from the server
    deleteDelivery(deliveryId) {
        return this.http.delete(this.getDomain() + deliveryId);
    }
    deleteDeliverys(ids = []) {
        const tasks$ = [];
        const length = ids.length;
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < length; i++) {
            tasks$.push(this.deleteDelivery(ids[i]));
        }
        return rxjs_1.forkJoin(tasks$);
    }
};
DeliveryService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], DeliveryService);
exports.DeliveryService = DeliveryService;
