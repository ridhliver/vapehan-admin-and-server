"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ongkirController_1 = __importDefault(require("../../../controllers/shipping/ongkir/ongkirController"));
class OngkirRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', ongkirController_1.default.list);
        this.router.get('/:id', ongkirController_1.default.ongkir);
        this.router.get('/order/:id', ongkirController_1.default.orderOngkir);
    }
}
const ongkirRoutes = new OngkirRoutes();
exports.default = ongkirRoutes.router;
