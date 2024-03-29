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
class InvoiceController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield database_1.default.query('SELECT a.*, (SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id in (SELECT id_customer FROM vh_order WHERE id_order = a.id_order)) as custName, (SELECT status from vh_order WHERE id_order = a.id_order) as stat FROM vh_invoice a');
            res.json(invoice);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const invoice = yield database_1.default.query('SELECT invoice, id_order FROM vh_invoice WHERE invoice= ? LIMIT 1', [id]);
            if (invoice.length > 0) {
                return res.json(invoice[0]);
            }
            res.status(404).json({ text: "Invoice doesn't exists " });
        });
    }
    listvouch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const invoice = yield database_1.default.query('SELECT a.id, a.id_order, a.status as stat, a.create_at, b.invoice, ' +
                '(SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = a.id_customer) as custName ' +
                'FROM vh_order a ' +
                'LEFT JOIN vh_invoice b ON a.id_order = b.id_order ' +
                'WHERE a.voucherid = ?', [id]);
            // console.log(invoice);
            return res.json(invoice);
        });
    }
    detailInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const invoice = yield database_1.default.query('SELECT q.id_order, q.invoice, DATE_FORMAT(q.create_at, "%Y-%m-%d") as date_order, w.id_product, w.name, w.quantity, w.price, w.subtotal, format(w.totalOngkir,0) as ongkir, w.weight, w.payid, w.color, w.nic, ' +
                'w.payment, w.namaongkir, w.ongkirService, w.id_customer, format(w.totalpay,0) as total, format((w.totalpay + w.totalOngkir + w.payid), 0) totalall, w.voucherid, format(w.amountvoucher + w.payid, 0) as amountv, w.vouchername, format(w.discount, 0) as harga_disc ' +
                'FROM vh_invoice q ' +
                'INNER JOIN ' +
                '(SELECT x.id_order, x.id_product, x.name, x.color, x.nic, x.quantity, format(x.harga, 0) as price, format((x.quantity * x.harga), 0) as subtotal, y.totalpay, c.id_customer, c.totalOngkir, c.payment, c.weight, c.payid, c.voucherid, c.amountvoucher, c.discount, d.vouchername, d.vouchertab, d.vouchervalue, c.courier as namaongkir, c.courier_service as ongkirService FROM (SELECT a.id_order, a.id_product, b.name, b.color, b.nic, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x LEFT JOIN (SELECT id_order, sum(quantity)as sumqty, SUM(quantity * harga) as totalpay FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ON x.id_order = y.id_order LEFT JOIN vh_order c ON x.id_order = c.id_order LEFT JOIN vh_voucher d ON c.voucherid = d.voucherid) w ON q.id_order = w.id_order', [id, id]);
            if (invoice.length > 0) {
                return res.json(invoice);
            } else {
                return res.json({ text: "Invoice doesnt exists" });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = {};
            yield database_1.default.query('INSERT INTO vh_order set ?', order);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const invoice = yield database_1.default.query('SELECT id FROM vh_invoice WHERE id = ?', [id]);
            yield database_1.default.query('DELETE FROM vh_invoice WHERE id = ?', [id]);
            if (invoice == "") {
                res.status(404).json({ text: "Invoice doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const invoice = yield database_1.default.query('SELECT id FROM vh_order WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id = ?', [req.body, id]);
            if (invoice == "") {
                res.status(404).json({ text: "Invoice doesn't exists" });
            }
            else {
                res.json({ message: 'The Invoice was Update' });
            }
        });
    }
}
const invoicecontroller = new InvoiceController();
exports.default = invoicecontroller;
