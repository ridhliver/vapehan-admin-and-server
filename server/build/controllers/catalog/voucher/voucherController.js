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
const database_1 = __importDefault(require("../../../database"));
class VoucherController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield database_1.default.query('SELECT id, voucherid, vouchername, DATE_FORMAT(fromdate, "%Y-%m-%d") as fromdate, DATE_FORMAT(todate, "%Y-%m-%d") as todate, vouchervalue, vouchertab, status, '+
            'stat, kouta, createdate, updatedate, description, format(vouchervalue, 0) as value, limit_pay, if(type = "pembayaran", 1, 2) as type, '+
            '(SELECT COUNT(voucherid) FROM vh_order WHERE voucherid = a.voucherid GROUP BY voucherid) as inuse '+
            'FROM vh_voucher a WHERE a.stat = 1');
            res.json(voucher);
        });
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield database_1.default.query('SELECT id, voucherid, vouchername, DATE_FORMAT(fromdate, "%Y-%m-%d") as fromdate, DATE_FORMAT(todate, "%Y-%m-%d") as todate, vouchervalue, vouchertab, status, kouta, stat, createdate, updatedate, description, format(vouchervalue, 0) as value, '+
            '(SELECT COUNT(voucherid) FROM vh_order WHERE voucherid = a.voucherid GROUP BY voucherid) as inuse '+
            'FROM vh_voucher a');
            res.json(voucher);
        });
    }
    getVochActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield database_1.default.query('SELECT a.*, format(a.vouchervalue, 0) as value, (SELECT COUNT(voucherid) FROM vh_order WHERE voucherid = a.voucherid GROUP BY voucherid) as inuse FROM vh_voucher a WHERE status = 1 AND todate >= DATE_FORMAT(NOW(),"%Y%m%d") AND stat = 1');
            res.json(voucher);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voucher = yield database_1.default.query('SELECT * FROM vh_voucher WHERE voucherid = ? LIMIT 1', [id]);
            // console.log(id, voucher);
            res.json(voucher);
        });
    }
    detailVoch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voucher = yield database_1.default.query('SELECT id, voucherid, vouchername, fromdate, todate, vouchervalue, vouchertab, status, kouta, limit_pay, if(type = "pembayaran", 1, 2) as type FROM vh_voucher WHERE id = ? LIMIT 1', [id]);
            // console.log(id, voucher);
            res.json(voucher[0]);
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                id: req.body.vid
            };
            try {
                const voucher = yield database_1.default.query('SELECT * FROM vh_voucher WHERE voucherid = ? AND status = 1 AND stat = 1 LIMIT 1', [data.id]);
                res.json(voucher[0]);
            }
            catch (_a) {
                res.json({ text: "Voucher doesnt exists" });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const date = new Date();
            const data = {
                voucherid: post.voucherid,
                vouchername: post.vouchername,
                fromdate: post.fromdate,
                todate: post.todate,
                vouchervalue: post.vouchervalue,
                vouchertab: post.vouchertab,
                status: post.status,
                stat: 1,
                kouta: post.kouta,
                createdate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
                updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
                limit_pay: post.limit_pay,
                type: post.type
            };
            // console.log(data);
            try {
                yield database_1.default.query('INSERT INTO vh_voucher set ? ', [data]);
                res.json({ text: 'Success' });
            }
            catch (err) {
                res.json({ text: 'failed' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voucher = yield database_1.default.query('SELECT id FROM vh_voucher WHERE id = ? ', [id]);
            yield database_1.default.query('UPDATE vh_voucher SET stat = 0 WHERE id = ?', [id]);
            if (voucher == "") {
                res.status(404).json({ text: "Voucher doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const post = req.body;
            const date = new Date();
            const hdr = {
                id: post.id,
                voucherid: post.voucherid,
                vouchername: post.vouchername,
                fromdate: post.fromdate,
                todate: post.todate,
                vouchervalue: post.vouchervalue,
                vouchertab: post.vouchertab,
                status: post.status,
                kouta: post.kouta,
                updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
                limit_pay: post.limit_pay,
                type: post.type
            };
            // console.log(hdr);
            const voucher = yield database_1.default.query('SELECT id FROM vh_voucher WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_voucher set ? WHERE id = ?', [hdr, id]);
            if (voucher == "") {
                res.status(404).json({ text: "Voucher doesn't exists" });
            }
            else {
                res.json({ message: 'The Voucher was Update' });
            }
        });
    }
    updateStat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const date = new Date();
            const data = {
                status: req.body.flag,
                updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            };
            const voucher = yield database_1.default.query('SELECT voucherid FROM vh_voucher WHERE voucherid = ?', [id]);
            yield database_1.default.query('UPDATE vh_voucher set ? WHERE voucherid = ?', [data, id]);
            if (voucher == "") {
                res.status(404).json({ text: "Voucher doesn't exists" });
            }
            else {
                res.json({ message: 'The Voucher was Update' });
            }
        });
    }
}
const vouchercontroller = new VoucherController();
exports.default = vouchercontroller;
