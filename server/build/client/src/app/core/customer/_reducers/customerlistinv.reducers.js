"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// NGRX
const store_1 = require("@ngrx/store");
const entity_1 = require("@ngrx/entity");
// Actions
const customerlistinv_actions_1 = require("../_actions/customerlistinv.actions");
// CRUD
const crud_1 = require("../../_base/crud");
exports.adapter = entity_1.createEntityAdapter();
exports.initialsListInvState = exports.adapter.getInitialState({
    listLoading: true,
    actionsloading: false,
    totalCount: 0,
    lastQuery: new crud_1.QueryParamsModel({}),
    lastCreatedId: undefined,
    showInitWaitingMessage: true
});
function ReducerListInv(state = exports.initialsListInvState, action) {
    switch (action.type) {
        case customerlistinv_actions_1.ListInvActionTypes.sListInvPageToggleLoading: return Object.assign({}, state, { listLoading: action.payload.isLoading, lastCreatedId: undefined });
        case customerlistinv_actions_1.ListInvActionTypes.sListInvActionToggleLoading: return Object.assign({}, state, { actionsloading: action.payload.isLoading });
        case customerlistinv_actions_1.ListInvActionTypes.ListInvOnServerCreated: return Object.assign({}, state);
        case customerlistinv_actions_1.ListInvActionTypes.ListInvCreated: return exports.adapter.addOne(action.payload.invoice, Object.assign({}, state, { lastCreatedId: action.payload.invoice.id }));
        case customerlistinv_actions_1.ListInvActionTypes.ListInvUpdated: return exports.adapter.updateOne(action.payload.partial, state);
        case customerlistinv_actions_1.ListInvActionTypes.OneListInvDeleted: return exports.adapter.removeOne(action.payload.id, state);
        case customerlistinv_actions_1.ListInvActionTypes.ManysListInvDeleted: return exports.adapter.removeMany(action.payload.ids, state);
        case customerlistinv_actions_1.ListInvActionTypes.sListInvPageCancelled: return Object.assign({}, state, { listLoading: false, lastQuery: new crud_1.QueryParamsModel({}) });
        case customerlistinv_actions_1.ListInvActionTypes.sListInvPageLoaded:
            return exports.adapter.addMany(action.payload.invoices, Object.assign({}, exports.initialsListInvState, { totalCount: action.payload.totalCount, listLoading: false, lastQuery: action.payload.page, showInitWaitingMessage: false }));
        default: return state;
    }
}
exports.ReducerListInv = ReducerListInv;
exports.getInvoiceState = store_1.createFeatureSelector('listinv');
_a = exports.adapter.getSelectors(), exports.selectAll = _a.selectAll, exports.selectEntities = _a.selectEntities, exports.selectIds = _a.selectIds, exports.selectTotal = _a.selectTotal;
