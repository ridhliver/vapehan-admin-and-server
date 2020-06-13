"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifController_1 = __importDefault(require("../../../controllers/order/notif/notifController"));
class NotifRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', notifController_1.default.orderlist);
        this.router.get('/confirm', notifController_1.default.confirmlist);
    }
}
const notifRoutes = new NotifRoutes();
exports.default = notifRoutes.router;
