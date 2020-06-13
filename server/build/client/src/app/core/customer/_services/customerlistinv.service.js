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
const API_CUSTOMER_URL = '/api/customer/invoice/list';
// Real REST API
let ListInvService = class ListInvService {
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'desc', '', 0, 10));
    }
    getDomain() {
        return this.httpUtils.domain + API_CUSTOMER_URL;
    }
    // CREATE =>  POST: add a new product to the server
    createCustomer(customer) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(this.getDomain(), customer, { headers: httpHeaders });
    }
    // READ
    getAllCustomerslistInv() {
        return this.http.get(this.getDomain() + `/${this.id_customer}`);
    }
    getCustomerById(customerId) {
        return this.http.get(this.getDomain() + `/${customerId}`);
    }
    // Server should return filtered/sorted result
    findCustomers(queryParams) {
        // Note: Add headers if needed (tokens/bearer)
        return this.getAllCustomerslistInv().pipe(operators_1.mergeMap(res => {
            const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
            return rxjs_1.of(result);
        }));
    }
    // UPDATE => PUT: update the product on the server
    updateCustomer(customer) {
        // Note: Add headers if needed (tokens/bearer)
        const id = customer.id_customer;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.put(this.getDomain() + `/${id}`, customer, { headers: httpHeaders });
    }
    // UPDATE => PUT: update the product on the server
    updateCustomerPhone(customer) {
        // Note: Add headers if needed (tokens/bearer)
        const id = customer.id_customer;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.put(this.getDomain() + `/phone/${id}`, customer, { headers: httpHeaders });
    }
    // DELETE => delete the product from the server
    deleteCustomer(orderId) {
        const url = `${this.getDomain()}/${orderId}`;
        return this.http.delete(url);
    }
    deleteCustomers(ids = []) {
        const tasks$ = [];
        const length = ids.length;
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < length; i++) {
            tasks$.push(this.deleteCustomer(ids[i]));
        }
        return rxjs_1.forkJoin(tasks$);
    }
};
ListInvService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ListInvService);
exports.ListInvService = ListInvService;
