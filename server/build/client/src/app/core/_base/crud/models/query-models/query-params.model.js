"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryParamsModel {
    // constructor overrides
    constructor(_filter, _sortOrder = 'desc', _sortField = '', _pageNumber = 0, _pageSize = 10) {
        this.filter = _filter;
        this.sortOrder = _sortOrder;
        this.sortField = _sortField;
        this.pageNumber = _pageNumber;
        this.pageSize = _pageSize;
    }
}
exports.QueryParamsModel = QueryParamsModel;
