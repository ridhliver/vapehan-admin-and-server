"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifController_1 = __importDefault(require("../../controllers/payment/notifController"));
const database_1 = __importDefault(require("../../database"));

class NotifRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/md/notif', notifController_1.default.notifmd);
    }
}
const notifRoutes = new NotifRoutes();
exports.default = notifRoutes.router;
