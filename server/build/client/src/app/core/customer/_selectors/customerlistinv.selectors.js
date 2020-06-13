"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NGRX
const store_1 = require("@ngrx/store");
// Lodash
const lodash_1 = require("lodash");
// CRUD
const crud_1 = require("../../_base/crud");
exports.selectsListInvState = store_1.createFeatureSelector('listinv');
exports.selectListInvById = (orderId) => store_1.createSelector(exports.selectsListInvState, sListInvState => sListInvState.entities[orderId]);
exports.selectsListInvPageLoading = store_1.createSelector(exports.selectsListInvState, sListInvState => sListInvState.listLoading);
exports.selectsListInvActionLoading = store_1.createSelector(exports.selectsListInvState, sListInvState => sListInvState.actionsloading);
exports.selectsListInvPageLastQuery = store_1.createSelector(exports.selectsListInvState, sListInvState => sListInvState.lastQuery);
exports.selectLastCreatedIdorder = store_1.createSelector(exports.selectsListInvState, sListInvState => sListInvState.lastCreatedId);
exports.selectsListInvInitWaitingMessage = store_1.createSelector(exports.selectsListInvState, sListInvState => sListInvState.showInitWaitingMessage);
exports.selectsListInvInStore = store_1.createSelector(exports.selectsListInvState, sListInvState => {
    const items = [];
    lodash_1.each(sListInvState.entities, element => {
        items.push(element);
    });
    const httpExtension = new crud_1.HttpExtenstionsModel();
    // tslint:disable-next-line: max-line-length
    const result = httpExtension.sortArray(items, sListInvState.lastQuery.sortField, sListInvState.lastQuery.sortOrder);
    return new crud_1.QueryResultsModel(result, sListInvState.totalCount, '');
});
exports.selectHassListInvInStore = store_1.createSelector(exports.selectsListInvInStore, queryResult => {
    if (!queryResult.totalCount) {
        return false;
    }
    return true;
});
