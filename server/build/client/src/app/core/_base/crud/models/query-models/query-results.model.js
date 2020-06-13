"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryResultsModel {
    constructor(_items = [], _totalCount = 0, _errorMessage = '') {
        this.items = _items;
        this.totalCount = _totalCount;
    }
}
exports.QueryResultsModel = QueryResultsModel;
