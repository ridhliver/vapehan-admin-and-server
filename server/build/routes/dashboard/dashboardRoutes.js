"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = __importDefault(require("../../controllers/dashboard/dashboardController"));
class DashboardRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/countsales', dashboardController_1.default.countSales);
        this.router.post('/', dashboardController_1.default.create);
        this.router.delete('/:id', dashboardController_1.default.delete);
        this.router.put('/:id', dashboardController_1.default.update);
    }
}
const dashboardRoutes = new DashboardRoutes();
exports.default = dashboardRoutes.router;
