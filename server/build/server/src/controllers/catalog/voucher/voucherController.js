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
const layout_utils_service_1 = require("../../../../../client/src/app/core/_base/crud/utils/layout-utils.service");
class VoucherController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield database_1.default.query('SELECT * FROM vh_voucher');
            res.json(voucher);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voucher = yield database_1.default.query('SELECT * FROM vh_voucher WHERE invoiceid = ? LIMIT 1', [id]);
            console.log(id, voucher);
            res.json(voucher);
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
                status: post.status,
                kouta: post.kouta,
                createdate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
                updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
            };
            console.log('success');
            console.log(data);
            try {
                yield database_1.default.query('INSERT INTO vh_voucher set ? ', [data]);
                res.json({ text: 'Success' });
                const message = `New voucher successfully has been added.`;
                this.layout.showActionNotification(message, layout_utils_service_1.MessageType.Create, 10000, true, true);
            }
            catch (err) {
                console.log('fail');
                res.json({ text: 'failed' });
                const message = `voucher already exist.`;
                this.layout.showActionNotification(message, layout_utils_service_1.MessageType.Create, 10000, true, true);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voucher = yield database_1.default.query('SELECT id FROM vh_voucher WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_voucher WHERE id = ?', [id]);
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
                status: post.status,
                kouta: post.kouta,
                updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
            };
            console.log(hdr);
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
