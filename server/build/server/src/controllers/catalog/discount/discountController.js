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
class DiscountController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield database_1.default.query('SELECT * FROM vh_discount_reg_hdr');
            res.json(discount);
        });
    }
    generate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const generate = yield database_1.default.query('SELECT MAX(number) as no FROM vh_numbersequence WHERE kode = "DS" LIMIT 1');
            res.json(generate[0]);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const date = new Date();
            const data = {
                id: post.id,
                kode_disc: post.kode_disc,
                description: post.description,
                from_date: post.from_date,
                to_date: post.to_date,
                discount: post.discount,
                flag_discount: post.flag_discount,
                status: post.status,
                create_by: post.create_by,
                date_create: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
                time_create: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            };
            //console.log(data);
            yield database_1.default.query('INSERT INTO vh_discount_reg_hdr set ? ', [data]);
            yield database_1.default.query('UPDATE vh_numbersequence set number = number + 1');
            res.json({ message: 'Success' });
        });
    }
    addDisc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            for (let i = 0; i < post.i_p.length; i++) {
                const dtl = {
                    kode_disc: post.kd_dsc,
                    id_product: post.i_p[i],
                    discountvalue: post.value,
                    discounttab: post.flg
                };
                yield database_1.default.query('INSERT INTO vh_discount_reg_dtl set ?', [dtl]);
            }
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const discount = yield database_1.default.query('SELECT id FROM vh_discount_reg_hdr WHERE id = ? ', [id]);
            yield database_1.default.query('CALL CancelDiscount(?)', [id]);
            if (discount == "") {
                res.status(404).json({ text: "Discount doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    dropProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const discount = yield database_1.default.query('SELECT id_product FROM vh_discount_reg_dtl WHERE id_product = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_discount_reg_dtl WHERE id_product = ?', [id]);
            if (discount == "") {
                res.status(404).json({ text: "Discount doesn't exists" });
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
            const hdr = {
                id: post.id,
                kode_disc: post.kode_disc,
                description: post.description,
                from_date: post.from_date,
                to_date: post.to_date,
                discount: post.discount,
                flag_discount: post.flag_discount,
                status: post.status,
                create_by: post.create_by,
            };
            // console.log(hdr);
            const discount = yield database_1.default.query('SELECT kode_disc FROM vh_discount_reg_hdr WHERE kode_disc = ?', [hdr.kode_disc]);
            yield database_1.default.query('UPDATE vh_discount_reg_hdr set ? WHERE id = ?', [hdr, id]);
            if (discount == "") {
                res.status(404).json({ text: "Discount doesn't exists" });
            }
            else {
                res.json({ message: 'The Discount was Update' });
            }
        });
    }
    updateStat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                status: req.body.flag
            };
            const discount = yield database_1.default.query('SELECT id FROM vh_discount_reg_hdr WHERE kode_disc = ?', [id]);
            yield database_1.default.query('UPDATE vh_discount_reg_hdr set ? WHERE kode_disc = ?', [data, id]);
            if (discount == "") {
                res.status(404).json({ text: "Discount doesn't exists" });
            }
            else {
                res.json({ message: 'The Discount was Update' });
            }
        });
    }
}
const discountcontroller = new DiscountController();
exports.default = discountcontroller;
