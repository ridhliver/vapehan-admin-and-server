"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingController_1 = __importDefault(require("./../../controllers/setting/settingController"));
const database_1 = __importDefault(require("../../database"));

class SettingRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', settingController_1.default.list);
        this.router.get('/get/macvisitor/today', settingController_1.default.Getmacvisitortoday);
        this.router.get('/get/allvisitor/today', settingController_1.default.getallvisitortoday);
        this.router.get('/get/androidvisitor/today', settingController_1.default.Getandroidvisitortoday);
        this.router.get('/get/windowvisitor/today', settingController_1.default.Getwindowvisitortoday);
        this.router.get('/get/iosvisitor/today', settingController_1.default.Getiosvisitortoday);
        this.router.get('/get/othervisitor/today', settingController_1.default.Getothervisitortoday);
        this.router.get('/get/macvisitor/month', settingController_1.default.Getmacvisitormonth);
        this.router.get('/get/allvisitor/month', settingController_1.default.getallvisitormonth);
        this.router.get('/get/androidvisitor/month', settingController_1.default.Getandroidvisitormonth);
        this.router.get('/get/windowvisitor/month', settingController_1.default.Getwindowvisitormonth);
        this.router.get('/get/iosvisitor/month', settingController_1.default.Getiosvisitormonth);
        this.router.get('/get/othervisitor/month', settingController_1.default.Getothervisitormonth);
        this.router.get('/get/macvisitor/lastmonth', settingController_1.default.Getmacvisitorlastmonth);
        this.router.get('/get/allvisitor/lastmonth', settingController_1.default.getallvisitorlastmonth);
        this.router.get('/get/androidvisitor/lastmonth', settingController_1.default.Getandroidvisitorlastmonth);
        this.router.get('/get/windowvisitor/lastmonth', settingController_1.default.Getwindowvisitorlastmonth);
        this.router.get('/get/iosvisitor/lastmonth', settingController_1.default.Getiosvisitorlastmonth);
        this.router.get('/get/othervisitor/lastmonth', settingController_1.default.Getothervisitorlastmonth);
        this.router.get('/count/donasi/covid', settingController_1.default.donasi);
        this.router.get('/get/payment/list', settingController_1.default.payls);
        this.router.get('/update/stock/product/ochinchi', settingController_1.default.upstpro);
        this.router.post('/new/visitor', settingController_1.default.visitor);
        this.router.post('/get/notif/payment', settingController_1.default.getNotif);
        this.router.put('/payment', settingController_1.default.updatePayment);
        this.router.put('/cart', settingController_1.default.updateCart);
    }
}
const settingRoutes = new SettingRoutes();
exports.default = settingRoutes.router;
