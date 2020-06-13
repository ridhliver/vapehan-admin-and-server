"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wholesaleController_1 = __importDefault(require("./../../controllers/wholesale/wholesaleController"));
const database_1 = __importDefault(require("../../database"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/assets/img/customer');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer_1.default({
    storage: storage,
    limits: {
        fileSize: 1280 * 1280 * 5
    },
    fileFilter: fileFilter
});
let mUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mImage', maxCount: 5 }]);
class WholesaleRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/get/all/:id', wholesaleController_1.default.getdataRegist);
        this.router.get('/edit/:id', wholesaleController_1.default.update);
        this.router.post('/owner', wholesaleController_1.default.createStore);
        this.router.post('/toko/:id', wholesaleController_1.default.createToko);
        this.router.post('/sosmed/:id', wholesaleController_1.default.createSosmed);
        this.router.post('/courier/:id', wholesaleController_1.default.createCourier);
        this.router.post('/del/courier/:id', wholesaleController_1.default.delCourier);
        this.router.post('/selesai/:id', wholesaleController_1.default.registSelesai);
        this.router.delete('/:id', wholesaleController_1.default.delete);
        
    }
}
const wholesaleRoutes = new WholesaleRoutes();
exports.default = wholesaleRoutes.router;
