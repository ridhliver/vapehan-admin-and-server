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
const http_1 = require("@angular/common/http");
const http_extentsions_model_1 = require("../../crud/models/http-extentsions-model");
let HttpUtilsService = class HttpUtilsService {
    constructor() {
        this.domain = 'http://192.168.1.160:4000';
    }
    /**
     * Prepare query http params
     * @param queryParams: QueryParamsModel
     */
    getFindHTTPParams(queryParams) {
        const params = new http_1.HttpParams()
            .set('lastNamefilter', queryParams.filter)
            .set('sortOrder', queryParams.sortOrder)
            .set('sortField', queryParams.sortField)
            .set('pageNumber', queryParams.pageNumber.toString())
            .set('pageSize', queryParams.pageSize.toString());
        return params;
    }
    /**
     * get standard content-type
     */
    getHTTPHeaders() {
        const result = new http_1.HttpHeaders();
        result.set('Content-Type', 'application/json');
        return result;
    }
    /*
    getDomain(): string {
        const url: string = 'localhost';
        return url;
    }
    */
    baseFilter(_entities, _queryParams, _filtrationFields = []) {
        const httpExtention = new http_extentsions_model_1.HttpExtenstionsModel();
        return httpExtention.baseFilter(_entities, _queryParams, _filtrationFields);
    }
    sortArray(_incomingArray, _sortField = '', _sortOrder = 'asc') {
        const httpExtention = new http_extentsions_model_1.HttpExtenstionsModel();
        return httpExtention.sortArray(_incomingArray, _sortField, _sortOrder);
    }
    searchInArray(_incomingArray, _queryObj, _filtrationFields = []) {
        const httpExtention = new http_extentsions_model_1.HttpExtenstionsModel();
        return httpExtention.searchInArray(_incomingArray, _queryObj, _filtrationFields);
    }
};
HttpUtilsService = __decorate([
    core_1.Injectable()
], HttpUtilsService);
exports.HttpUtilsService = HttpUtilsService;
