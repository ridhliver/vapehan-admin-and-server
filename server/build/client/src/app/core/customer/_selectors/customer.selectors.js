"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NGRX
const store_1 = require("@ngrx/store");
// Lodash
const lodash_1 = require("lodash");
// CRUD
const crud_1 = require("../../_base/crud");
exports.selectCustomersState = store_1.createFeatureSelector('customers');
exports.selectCustomerById = (customerId) => store_1.createSelector(exports.selectCustomersState, customersState => customersState.entities[customerId]);
exports.selectCustomersPageLoading = store_1.createSelector(exports.selectCustomersState, customersState => customersState.listLoading);
exports.selectCustomersActionLoading = store_1.createSelector(exports.selectCustomersState, customersState => customersState.actionsloading);
exports.selectCustomersPageLastQuery = store_1.createSelector(exports.selectCustomersState, customersState => customersState.lastQuery);
exports.selectLastCreatedCustomerId = store_1.createSelector(exports.selectCustomersState, customersState => customersState.lastCreatedCustomerId);
exports.selectCustomersInitWaitingMessage = store_1.createSelector(exports.selectCustomersState, customersState => customersState.showInitWaitingMessage);
exports.selectCustomersInStore = store_1.createSelector(exports.selectCustomersState, customersState => {
    const items = [];
    lodash_1.each(customersState.entities, element => {
        items.push(element);
    });
    const httpExtension = new crud_1.HttpExtenstionsModel();
    // tslint:disable-next-line: max-line-length
    const result = httpExtension.sortArray(items, customersState.lastQuery.sortField, customersState.lastQuery.sortOrder);
    return new crud_1.QueryResultsModel(result, customersState.totalCount, '');
});
exports.selectHasCustomersInStore = store_1.createSelector(exports.selectCustomersInStore, queryResult => {
    if (!queryResult.totalCount) {
        return false;
    }
    return true;
});
