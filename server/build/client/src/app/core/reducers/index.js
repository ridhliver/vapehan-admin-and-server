"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ngrx_store_freeze_1 = require("ngrx-store-freeze");
const router_store_1 = require("@ngrx/router-store");
const environment_1 = require("../../../environments/environment");
exports.reducers = { router: router_store_1.routerReducer };
exports.metaReducers = !environment_1.environment.production ? [ngrx_store_freeze_1.storeFreeze] : [];
