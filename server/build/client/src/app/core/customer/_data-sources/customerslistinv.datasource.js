"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customerlistinv_selectors_1 = require("../_selectors/customerlistinv.selectors");
// CRUD
const crud_1 = require("../../_base/crud");
// State
const store_1 = require("@ngrx/store");
// Selectors
const customerlistinv_selectors_2 = require("../_selectors/customerlistinv.selectors");
class ListInvDataSource extends crud_1.BaseDataSource {
    constructor(store) {
        super();
        this.store = store;
        this.loading$ = this.store.pipe(store_1.select(customerlistinv_selectors_2.selectsListInvPageLoading));
        this.isPreloadTextViewed$ = this.store.pipe(store_1.select(customerlistinv_selectors_1.selectsListInvInitWaitingMessage));
        this.store.pipe(store_1.select(customerlistinv_selectors_2.selectsListInvInStore)).subscribe((response) => {
            this.paginatorTotalSubject.next(response.totalCount);
            this.entitySubject.next(response.items);
        });
    }
}
exports.ListInvDataSource = ListInvDataSource;
