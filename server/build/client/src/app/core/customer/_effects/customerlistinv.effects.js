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
const customerlistinv_actions_1 = require("../_actions/customerlistinv.actions");
const rxjs_2 = require("rxjs");
let ListInvEffects = class ListInvEffects {
    constructor(actions$, invoicesService, store) {
        this.actions$ = actions$;
        this.invoicesService = invoicesService;
        this.store = store;
        this.showPageLoadingDistpatcher = new customerlistinv_actions_1.ListInvPageToggleLoading({ isLoading: true });
        this.showActionLoadingDistpatcher = new customerlistinv_actions_1.ListInvActionToggleLoading({ isLoading: true });
        this.hideActionLoadingDistpatcher = new customerlistinv_actions_1.ListInvActionToggleLoading({ isLoading: false });
        this.loadInvoicesPage$ = this.actions$.pipe(effects_1.ofType(customerlistinv_actions_1.ListInvActionTypes.sListInvPageRequested), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showPageLoadingDistpatcher);
            const requestToServer = this.invoicesService.findCustomers(payload.page);
            const lastQuery = rxjs_2.of(payload.page);
            // tslint:disable-next-line: deprecation
            return rxjs_1.forkJoin(requestToServer, lastQuery);
        }), operators_1.map(response => {
            const result = response[0];
            const lastQuery = response[1];
            const pageLoadedDispatch = new customerlistinv_actions_1.ListInvPageLoaded({
                invoices: result.items,
                totalCount: result.totalCount,
                page: lastQuery
            });
            return pageLoadedDispatch;
        }));
        this.deleteInvoice$ = this.actions$
            .pipe(effects_1.ofType(customerlistinv_actions_1.ListInvActionTypes.OneListInvDeleted), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.invoicesService.deleteCustomer(payload.id);
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
        this.deleteInvoices$ = this.actions$
            .pipe(effects_1.ofType(customerlistinv_actions_1.ListInvActionTypes.ManysListInvDeleted), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.invoicesService.deleteCustomers(payload.ids);
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
        this.updateInvoice$ = this.actions$
            .pipe(effects_1.ofType(customerlistinv_actions_1.ListInvActionTypes.ListInvUpdated), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.invoicesService.updateCustomer(payload.invoice);
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
        this.createInvoice$ = this.actions$
            .pipe(effects_1.ofType(customerlistinv_actions_1.ListInvActionTypes.ListInvOnServerCreated), operators_1.mergeMap(({ payload }) => {
            this.store.dispatch(this.showActionLoadingDistpatcher);
            return this.invoicesService.createCustomer(payload.invoice).pipe(operators_1.tap(res => {
                this.store.dispatch(new customerlistinv_actions_1.ListInvCreated({ invoice: res }));
            }));
        }), operators_1.map(() => {
            return this.hideActionLoadingDistpatcher;
        }));
    }
};
__decorate([
    effects_1.Effect()
], ListInvEffects.prototype, "loadInvoicesPage$", void 0);
__decorate([
    effects_1.Effect()
], ListInvEffects.prototype, "deleteInvoice$", void 0);
__decorate([
    effects_1.Effect()
], ListInvEffects.prototype, "deleteInvoices$", void 0);
__decorate([
    effects_1.Effect()
], ListInvEffects.prototype, "updateInvoice$", void 0);
__decorate([
    effects_1.Effect()
], ListInvEffects.prototype, "createInvoice$", void 0);
ListInvEffects = __decorate([
    core_1.Injectable()
], ListInvEffects);
exports.ListInvEffects = ListInvEffects;
