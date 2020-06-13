"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// RxJS
const rxjs_1 = require("rxjs");
// CRUD
const http_extentsions_model_1 = require("./http-extentsions-model");
const operators_1 = require("rxjs/operators");
// Why not use MatTableDataSource?
/*  In this example, we will not be using the built-in MatTableDataSource because its designed for filtering,
    sorting and pagination of a client - side data array.
    Read the article: 'https://blog.angular-university.io/angular-material-data-table/'
**/
class BaseDataSource {
    constructor() {
        this.entitySubject = new rxjs_1.BehaviorSubject([]);
        this.hasItems = true; // Need to show message: 'No records found'
        this.isPreloadTextViewed$ = rxjs_1.of(true);
        // Paginator | Paginators count
        this.paginatorTotalSubject = new rxjs_1.BehaviorSubject(0);
        this.subscriptions = [];
        this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
        // subscribe hasItems to (entitySubject.length==0)
        const hasItemsSubscription = this.paginatorTotal$.pipe(operators_1.distinctUntilChanged(), operators_1.skip(1)).subscribe(res => this.hasItems = res > 0);
        this.subscriptions.push(hasItemsSubscription);
    }
    connect(collectionViewer) {
        // Connecting data source
        return this.entitySubject.asObservable();
    }
    disconnect(collectionViewer) {
        // Disonnecting data source
        this.entitySubject.complete();
        this.paginatorTotalSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
    baseFilter(_entities, _queryParams, _filtrationFields = []) {
        const httpExtention = new http_extentsions_model_1.HttpExtenstionsModel();
        return httpExtention.baseFilter(_entities, _queryParams, _filtrationFields);
    }
    sortArray(_incomingArray, _sortField = '', _sortOrder = 'desc') {
        const httpExtention = new http_extentsions_model_1.HttpExtenstionsModel();
        return httpExtention.sortArray(_incomingArray, _sortField, _sortOrder);
    }
    searchInArray(_incomingArray, _queryObj, _filtrationFields = []) {
        const httpExtention = new http_extentsions_model_1.HttpExtenstionsModel();
        return httpExtention.searchInArray(_incomingArray, _queryObj, _filtrationFields);
    }
}
exports.BaseDataSource = BaseDataSource;
