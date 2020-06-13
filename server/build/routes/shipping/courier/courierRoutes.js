"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courierController_1 = __importDefault(require("../../../controllers/shipping/courier/courierController"));
class CourierRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', courierController_1.default.list);
    }
}
const courierRoutes = new CourierRoutes();
exports.default = courierRoutes.router;
