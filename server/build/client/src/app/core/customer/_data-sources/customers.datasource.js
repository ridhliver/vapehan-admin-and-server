"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customer_selectors_1 = require("../_selectors/customer.selectors");
// CRUD
const crud_1 = require("../../_base/crud");
// State
const store_1 = require("@ngrx/store");
// Selectors
const customer_selectors_2 = require("../_selectors/customer.selectors");
class CustomersDataSource extends crud_1.BaseDataSource {
    constructor(store) {
        super();
        this.store = store;
        this.loading$ = this.store.pipe(store_1.select(customer_selectors_2.selectCustomersPageLoading));
        this.isPreloadTextViewed$ = this.store.pipe(store_1.select(customer_selectors_1.selectCustomersInitWaitingMessage));
        this.store.pipe(store_1.select(customer_selectors_2.selectCustomersInStore)).subscribe((response) => {
            this.paginatorTotalSubject.next(response.totalCount);
            this.entitySubject.next(response.items);
        });
    }
}
exports.CustomersDataSource = CustomersDataSource;
