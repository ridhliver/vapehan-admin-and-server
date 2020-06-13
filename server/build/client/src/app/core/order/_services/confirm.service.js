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
const API_CONFIRM_URL = '/api/order/confirm';
// Real REST API
let ConfirmService = class ConfirmService {
    // getConfirm$: Observable<any>; private getConfirmSubject = new Subject<any>()
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'desc', '', 0, 10));
        // tslint:disable-next-line: member-ordering
        this._refreshNeeded$ = new rxjs_1.Subject();
        // this.getConfirm$ = this.getConfirmSubject.asObservable();
    }
    getDomain() {
        return this.httpUtils.domain + API_CONFIRM_URL;
    }
    get refreshNeeded$() {
        return this._refreshNeeded$;
    }
    /*
getConfirm(data) {
   console.log(data);
   this.getConfirmSubject.next(data);
}
*/
    // CREATE =>  POST: add a new product to the server
    createConfirm(confirm) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(this.getDomain(), confirm, { headers: httpHeaders }).pipe(operators_1.tap(() => {
            this._refreshNeeded$.next();
        }));
    }
    // READ
    getAllConfirms() {
        return this.http.get(this.getDomain());
    }
    getConfirmById(confirmId) {
        return this.http.get(this.getDomain() + `/${confirmId}`);
    }
    // Server should return filtered/sorted result
    findConfirms(queryParams) {
        // Note: Add headers if needed (tokens/bearer)
        return this.getAllConfirms().pipe(operators_1.mergeMap(res => {
            const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
            return rxjs_1.of(result);
        }));
    }
    // UPDATE => PUT: update the product on the server
    updateConfirm(confirm) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = confirm.get('id');
        const APi_URL = this.httpUtils.domain + '/api/catalog/confirm/';
        return this.http.put(APi_URL + id, confirm, { headers: httpHeaders });
    }
    // UPDATE
    confirmPayment(data, address) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = data.id_order;
        const status = {
            invoice: data.invoice,
            id_order: data.id_order,
            create_at: data.create_at,
            status: 1,
            address: address
        };
        // console.log(status);
        return this.http.put(this.getDomain() + `/confirmPay/${id}`, status, { headers: httpHeaders });
    }
    // DELETE => delete the product from the server
    deleteConfirm(confirmId) {
        const url = `${this.getDomain()}/${confirmId}`;
        return this.http.delete(url);
    }
    deleteCategories(ids = []) {
        const tasks$ = [];
        const length = ids.length;
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < length; i++) {
            tasks$.push(this.deleteConfirm(ids[i]));
        }
        return rxjs_1.forkJoin(tasks$);
    }
};
ConfirmService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ConfirmService);
exports.ConfirmService = ConfirmService;
