"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = __importDefault(require("../../../controllers/shipping/address/addressController"));
class AddressRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:id', addressController_1.default.list);
    }
}
const addressRoutes = new AddressRoutes();
exports.default = addressRoutes.router;
