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
const API_INVOICE_URL = '/api/order/invoice/';
// Real REST API
let InvoiceService = class InvoiceService {
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'asc', '', 0, 10));
    }
    getDomain() {
        return this.httpUtils.domain + API_INVOICE_URL;
    }
    // CREATE =>  POST: add a new invoice to the server
    createInvoice(invoice) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(this.getDomain(), invoice, { headers: httpHeaders });
    }
    // READ
    getAllInvoices() {
        return this.http.get(this.getDomain());
    }
    getInvoiceById(invoiceId) {
        return this.http.get(this.getDomain() + `/${invoiceId}`);
    }
    getInvoiceByOrder(orderId) {
        return this.http.get(this.getDomain() + `order/${orderId}`);
    }
    // Server should return filtered/sorted result
    findInvoices(queryParams) {
        // Note: Add headers if needed (tokens/bearer)
        return this.getAllInvoices().pipe(operators_1.mergeMap(res => {
            const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
            return rxjs_1.of(result);
        }));
    }
    // UPDATE => PUT: update the invoice on the server
    updateInvoice(invoice) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = invoice.id;
        const APi_URL = this.httpUtils.domain + '/api/catalog/product/';
        return this.http.put(APi_URL + id, invoice, { headers: httpHeaders });
    }
    // DELETE => delete the invoice from the server
    deleteInvoice(invoiceId) {
        return this.http.delete(this.getDomain() + invoiceId);
    }
    deleteInvoices(ids = []) {
        const tasks$ = [];
        const length = ids.length;
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < length; i++) {
            tasks$.push(this.deleteInvoice(ids[i]));
        }
        return rxjs_1.forkJoin(tasks$);
    }
};
InvoiceService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], InvoiceService);
exports.InvoiceService = InvoiceService;
