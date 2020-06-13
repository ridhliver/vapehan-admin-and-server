"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucherController_1 = __importDefault(require("../../../controllers/catalog/voucher/voucherController"));
class VoucherRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', voucherController_1.default.list);
        this.router.get('/:id', voucherController_1.default.detail);
        this.router.post('/', voucherController_1.default.create);
        this.router.delete('/:id', voucherController_1.default.delete);
        this.router.put('/:id', voucherController_1.default.update);
        this.router.put('/upStat/:id', voucherController_1.default.updateStat);
    }
}
const voucherRoutes = new VoucherRoutes();
exports.default = voucherRoutes.router;
