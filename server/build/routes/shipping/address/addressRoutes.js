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
        this.router.get('/provinces', addressController_1.default.provinces);
        this.router.get('/provinces/:id', addressController_1.default.provinces_dtl);
        this.router.get('/citys', addressController_1.default.cities);
        this.router.get('/district', addressController_1.default.districts);
        this.router.post('/saveProv', addressController_1.default.saveProv);
        this.router.post('/saveCity', addressController_1.default.saveCity);
        this.router.post('/saveDist', addressController_1.default.saveDist);
        this.router.put('/editProv/:id', addressController_1.default.editProv);
        this.router.put('/editCity/:id', addressController_1.default.editCity);
        this.router.put('/editDist/:id', addressController_1.default.editDist);
    }
}
const addressRoutes = new AddressRoutes();
exports.default = addressRoutes.router;
