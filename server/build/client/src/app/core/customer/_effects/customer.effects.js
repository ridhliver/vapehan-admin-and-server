"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
// Angular
const core_1 = require("@angular/core");
// RxJS
const operators_1 = require("rxjs/operators");
// NGRX
const effects_1 = require("@ngrx/effects");
// Actions
const customer_actions_1 = require("../_actions/customer.actions");
const rxjs_2 = require("rxjs");
let CustomerEffects = class CustomerEffects {
    constructor(actions$, customersService, store) {
        this.actions$ = actions$;
        this.customersService = customersService;
        this.store = store;
        this.showPageLoadingDistpatcher = new customer_actions_1.CustomersPageToggleLoading({ isLoading: true });
        this.showActionLoadingDistpatcher = new customer_actions_1.CustomersActionToggleLoading({ isLoading: true });
        this.hideActionLoadingDistpatcher = new customer_actions_1.CustomersActionToggleLoading({ isLoading: false });
        this.loadCustomersPage$ = this.actions$.pipe(effects_1.ofType(customer_actions_1.CustomerActionTypes.CustomersPageRequested), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showPageLoadingDistpatcher);
            const requestToServer = this.customersService.findCustomers(payload.page);
            const lastQuery = rxjs_2.of(payload.page);
            // tslint:disable-next-line: deprecation
            return rxjs_1.forkJoin(requestToServer, lastQuery);
        }), operators_1.map(response => {
            const result = response[0];
            const lastQuery = response[1];
            const pageLoadedDispatch = new customer_actions_1.CustomersPageLoaded({
                customers: result.items,
                totalCount: result.totalCount,
                page: lastQuery
            });
            return pageLoadedDispatch;
        }));
        this.deleteCustomer$ = this.actions$
            .pipe(effects_1.ofType(customer_actions_1.CustomerActionTypes.OneCustomerDeleted), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.customersService.deleteCustomer(payload.id);
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
        this.deleteCustomers$ = this.actions$
            .pipe(effects_1.ofType(customer_actions_1.CustomerActionTypes.ManyCustomersDeleted), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.customersService.deleteCustomers(payload.ids);
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
        this.updateCustomer$ = this.actions$
            .pipe(effects_1.ofType(customer_actions_1.CustomerActionTypes.CustomerUpdated), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.customersService.updateCustomer(payload.customer);
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
        this.createCustomer$ = this.actions$
            .pipe(effects_1.ofType(customer_actions_1.CustomerActionTypes.CustomerOnServerCreated), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.customersService.createCustomer(payload.customer).pipe(operators_1.tap(res => {
                this.store.dispatch(new customer_actions_1.CustomerCreated({ customer: res }));
            }));
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
    }
};
__decorate([
    effects_1.Effect()
], CustomerEffects.prototype, "loadCustomersPage$", void 0);
__decorate([
    effects_1.Effect()
], CustomerEffects.prototype, "deleteCustomer$", void 0);
__decorate([
    effects_1.Effect()
], CustomerEffects.prototype, "deleteCustomers$", void 0);
__decorate([
    effects_1.Effect()
], CustomerEffects.prototype, "updateCustomer$", void 0);
__decorate([
    effects_1.Effect()
], CustomerEffects.prototype, "createCustomer$", void 0);
CustomerEffects = __decorate([
    core_1.Injectable()
], CustomerEffects);
exports.CustomerEffects = CustomerEffects;
