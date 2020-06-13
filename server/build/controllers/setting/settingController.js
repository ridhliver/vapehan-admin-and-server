"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const local = __importDefault(require("../../database"));
var schedule = require('node-schedule');
var dateFormat = require('dateformat');
var rule = new schedule.RecurrenceRule();
class SettingController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield database_1.default.query('SELECT * FROM vh_setting LIMIT 1');
            res.json(setting[0]);
            /*
            console.log('test');
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const notifOrder = yield database_1.default.query('SELECT id_order FROM vh_order WHERE status = 0 AND exp_date > NOW()');
                    const accOrder = yield database_1.default.query('SELECT a.id_order '+
                    'FROM vh_order a '+
                    'LEFT JOIN vh_confirm_order b '+
                    'ON a.id_order = b.transaction_id '+
                    'WHERE a.status = 4 AND NOW() > b.create_at');
                    const processOrder = yield database_1.default.query('SELECT id_order FROM vh_order WHERE status = 5 AND NOW() > editDate');
                    const sendingOrder = yield database_1.default.query('SELECT id_order FROM vh_order WHERE status = 1 AND NOW() > editDate');

                    rule.hour = 5;

                    schedule.scheduleJob(rule, function(){
                        console.log('Time for tea!');
                    });

                    
                });
            }
            main();
            */
        });
    }
    updatePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('UPDATE vh_setting set payment = ?', [req.body]);
            res.json({ message: 'The payment setting was Update' });
        });
    }
    Getmacvisitortoday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Mac" AND date = CURDATE() AND time BETWEEN "00:00:00" AND "23:59:59"');
            res.json(visitor[0]);
        });
    }
    getallvisitortoday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE date = CURDATE() AND time BETWEEN "00:00:00" AND "23:59:59"');
            res.json(visitor[0]);
        });
    }
    Getandroidvisitortoday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Android" AND date = CURDATE() AND time BETWEEN "00:00:00" AND "23:59:59"');
            res.json(visitor[0]);
        });
    }
    Getwindowvisitortoday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Windows" AND date = CURDATE() AND time BETWEEN "00:00:00" AND "23:59:59"');
            res.json(visitor[0]);
        });
    }
    Getiosvisitortoday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "iOS" AND date = CURDATE() AND time BETWEEN "00:00:00" AND "23:59:59"');
            res.json(visitor[0]);
        });
    }
    Getothervisitortoday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Unknown" AND date = CURDATE() AND time BETWEEN "00:00:00" AND "23:59:59"');
            res.json(visitor[0]);
        });
    }
    /* ============================= Month =========================== */
    Getmacvisitormonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Mac" AND MONTH(date) = MONTH(CURDATE())');
            res.json(visitor[0]);
        });
    }
    getallvisitormonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE MONTH(date) = MONTH(CURDATE())');
            res.json(visitor[0]);
        });
    }
    Getandroidvisitormonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Android" AND MONTH(date) = MONTH(CURDATE())');
            res.json(visitor[0]);
        });
    }
    Getwindowvisitormonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Windows" AND MONTH(date) = MONTH(CURDATE())');
            res.json(visitor[0]);
        });
    }
    Getiosvisitormonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "iOS" AND MONTH(date) = MONTH(CURDATE())');
            res.json(visitor[0]);
        });
    }
    Getothervisitormonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Unknown" AND MONTH(date) = MONTH(CURDATE())');
            res.json(visitor[0]);
        });
    }
    /* ============================= Last Month =========================== */
    Getmacvisitorlastmonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Mac" AND MONTH(date) = MONTH(?)', [month]);
            res.json(visitor[0]);
        });
    }
    getallvisitorlastmonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
            // console.log(month);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE MONTH(date) = MONTH(?)', [month]);
            res.json(visitor[0]);
        });
    }
    Getandroidvisitorlastmonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Android" AND MONTH(date) = MONTH(?)', [month]);
            res.json(visitor[0]);
        });
    }
    Getwindowvisitorlastmonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Windows" AND MONTH(date) = MONTH(?)', [month]);
            res.json(visitor[0]);
        });
    }
    Getiosvisitorlastmonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "iOS" AND MONTH(date) = MONTH(?)', [month]);
            res.json(visitor[0]);
        });
    }
    Getothervisitorlastmonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
            const visitor = yield database_1.default.query('SELECT COUNT(os) as visitor FROM vh_visitor '+ 
           'WHERE os = "Unknown" AND MONTH(date) = MONTH(?)', [month]);
            res.json(visitor[0]);
        });
    }
    donasi(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const donasi = yield database_1.default.query('SELECT sum(donasi) as donasi FROM vh_donatur WHERE status = 1');
            res.json(donasi[0]);
        });
    }
    payls(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const payment = yield database_1.default.query('SELECT * FROM vh_payment_list WHERE status = 1');
            res.json(payment);
        });
    }
    upstpro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
              
            rule.hour = 1;

            schedule.scheduleJob(rule, function(){
                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const prod = yield local.local.query('SELECT barcode, qty FROM masterproductretail');

                        if (prod.length > 0) {
                            for (let i = 0; i < prod.length; i++) {
                                yield database_1.default.query('UPDATE vh_product SET stock = ? WHERE barcode = ?', [prod[i].qty, prod[i].barcode]);
                            }
                        }
                        console.log('Update Stock');
                    });
                }
                main();
            });

            res.json({text : 'ok'});
        });
    }
    visitor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const visitor = {
                ip: req.body.ip,
                token: req.body.token,
                browser: req.body.static.browser,
                os: req.body.static.os,
                ket: req.body.ket,
                date: dateFormat(new Date(), "yyyy-mm-dd"),
                time: dateFormat(new Date(), "h:MM:ss TT")
            };
            
            yield database_1.default.query('INSERT into vh_visitor set ?', [visitor]);
            res.json({ message: 'Toko Vaporizer Jakarta Indonesia - Vapehan' });
        });
    }
    getNotif(req, res) {
        return __awaiter(this, void 0, void 0, function* () {

            let notif= '';

            const data_notif = {
                notif: notif
            };

            if (req.body === 'gift') {
                notif = 'success';
                res.json({ text: 'Ok' });
            } else if (req.body === 'get') {
                res.json(data_notif);
            }
        });
    }
    updateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('UPDATE vh_setting set cart = ?', [req.body.stat]);
            res.json({ message: 'The cart setting was Update' });
        });
    }
}
const settingcontroller = new SettingController();
exports.default = settingcontroller;
