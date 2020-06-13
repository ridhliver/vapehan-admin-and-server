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
const API_ORDER_URL = '/api/order/orders/';
// Real REST API
let OrderService = class OrderService {
    constructor(http, httpUtils) {
        this.http = http;
        this.httpUtils = httpUtils;
        this.lastFilter$ = new rxjs_1.BehaviorSubject(new crud_1.QueryParamsModel({}, 'asc', '', 0, 10));
    }
    getDomain() {
        return this.httpUtils.domain + API_ORDER_URL;
    }
    // CREATE =>  POST: add a new order to the server
    createOrder(order) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(this.getDomain(), order, { headers: httpHeaders });
    }
    // READ
    getAllOrders() {
        return this.http.get(this.getDomain());
    }
    getOrderById(orderId) {
        return this.http.get(this.getDomain() + `/${orderId}`);
    }
    getOrderByOrder(orderId) {
        this.idOrder = orderId;
        // console.log(this.getDomain());
        return this.http.get(this.getDomain() + `orderHeaderA/${orderId}`);
    }
    getCustomerOrderByCustomer(orderId) {
        this.idOrder = orderId;
        return this.http.get(this.getDomain() + `orderHeaderB/${orderId}`);
    }
    getDetailOrderByOrder(orderId) {
        this.idOrder = orderId;
        return this.http.get(this.getDomain() + `detailOrder/${orderId}`);
    }
    // call back end server to load order detail by : id Order
    /*
    getOrderDetail(orderId: string): Observable<OrderDetailModels[]> {
        return this.http.get<OrderDetailModels[]>(this.getDomain()+`detailOrder/${orderId}`);
    }


    //find getorderdetail() to load table view in web
    findOrderDetail(queryParams: QueryParamsModel, id: string): Observable<QueryResultsModel> {
        return this.getOrderDetail(id).pipe(
            mergeMap(res => {
                const result = this.httpUtils.baseFilter(res, queryParams, ['id_order', 'id_order']);
                return of(result);
            })
        );
    }
    */
    // Server should return filtered/sorted result
    findOrders(queryParams) {
        // Note: Add headers if needed (tokens/bearer)
        return this.getAllOrders().pipe(operators_1.mergeMap(res => {
            const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
            return rxjs_1.of(result);
        }));
    }
    // UPDATE => PUT: update the order on the server
    updateOrder(order) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = order.id;
        const APi_URL = this.getDomain() + '/api/catalog/product/';
        return this.http.put(APi_URL + id, order, { headers: httpHeaders });
    }
    // UPDATE => PUT: update the order on the server
    updatestatus(order) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = order.id_order;
        const APi_URL = this.getDomain() + 'status/';
        return this.http.put(APi_URL + id, order, { headers: httpHeaders });
    }
    accPayment(order) {
        // Note: Add headers if needed (tokens/bearer)
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const id = order.id_order;
        const APi_URL = this.getDomain() + 'status/accPay/';
        return this.http.put(APi_URL + id, order, { headers: httpHeaders });
    }
    // DELETE => delete the order from the server
    deleteOrder(orderId) {
        return this.http.delete(this.getDomain() + orderId);
    }
    deleteOrders(ids = []) {
        const tasks$ = [];
        const length = ids.length;
        // tslint:disable-next-line:prefer-const
        for (let i = 0; i < length; i++) {
            tasks$.push(this.deleteOrder(ids[i]));
        }
        return rxjs_1.forkJoin(tasks$);
    }
};
OrderService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], OrderService);
exports.OrderService = OrderService;
