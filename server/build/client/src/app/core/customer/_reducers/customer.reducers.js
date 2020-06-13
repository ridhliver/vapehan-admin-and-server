"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// NGRX
const store_1 = require("@ngrx/store");
const entity_1 = require("@ngrx/entity");
// Actions
const customer_actions_1 = require("../_actions/customer.actions");
// CRUD
const crud_1 = require("../../_base/crud");
exports.adapter = entity_1.createEntityAdapter();
exports.initialCustomersState = exports.adapter.getInitialState({
    listLoading: true,
    actionsloading: false,
    totalCount: 0,
    lastQuery: new crud_1.QueryParamsModel({}),
    lastCreatedCustomerId: undefined,
    showInitWaitingMessage: true
});
function customersReducer(state = exports.initialCustomersState, action) {
    switch (action.type) {
        case customer_actions_1.CustomerActionTypes.CustomersPageToggleLoading: return Object.assign({}, state, { listLoading: action.payload.isLoading, lastCreatedCustomerId: undefined });
        case customer_actions_1.CustomerActionTypes.CustomersActionToggleLoading: return Object.assign({}, state, { actionsloading: action.payload.isLoading });
        case customer_actions_1.CustomerActionTypes.CustomerOnServerCreated: return Object.assign({}, state);
        case customer_actions_1.CustomerActionTypes.CustomerCreated: return exports.adapter.addOne(action.payload.customer, Object.assign({}, state, { lastCreatedCustomerId: action.payload.customer.id }));
        case customer_actions_1.CustomerActionTypes.CustomerUpdated: return exports.adapter.updateOne(action.payload.partialCustomer, state);
        case customer_actions_1.CustomerActionTypes.OneCustomerDeleted: return exports.adapter.removeOne(action.payload.id, state);
        case customer_actions_1.CustomerActionTypes.ManyCustomersDeleted: return exports.adapter.removeMany(action.payload.ids, state);
        case customer_actions_1.CustomerActionTypes.CustomersPageCancelled: return Object.assign({}, state, { listLoading: false, lastQuery: new crud_1.QueryParamsModel({}) });
        case customer_actions_1.CustomerActionTypes.CustomersPageLoaded:
            return exports.adapter.addMany(action.payload.customers, Object.assign({}, exports.initialCustomersState, { totalCount: action.payload.totalCount, listLoading: false, lastQuery: action.payload.page, showInitWaitingMessage: false }));
        default: return state;
    }
}
exports.customersReducer = customersReducer;
exports.getCustomerState = store_1.createFeatureSelector('customers');
_a = exports.adapter.getSelectors(), exports.selectAll = _a.selectAll, exports.selectEntities = _a.selectEntities, exports.selectIds = _a.selectIds, exports.selectTotal = _a.selectTotal;
