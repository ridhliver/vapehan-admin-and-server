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
var nodemailer = require('nodemailer');
class CInvoiceController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const invoice = yield database_1.default.query('SELECT a.id, a.id_order, a.create_at, a.status, c.invoice, ' +
                '(SELECT CONCAT(b.firstname," ",b.lastname) as name FROM vh_customer b WHERE a.id_customer = b.id LIMIT 1) as Cusname, ' +
                '(SELECT resi FROM vh_shipping d WHERE a.id_order = d.id_order LIMIT 1) as resi ' +
                'FROM vh_order a ' +
                'LEFT JOIN vh_invoice c ON a.id_order = c.id_order ' +
                'WHERE a.id_customer = ? AND c.invoice IS NOT NULL', [id]);
            res.json(invoice);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const customer = {
                firstname: post.firstname,
                lastname: post.lastname,
                email: post.email,
                verification: false,
                accessToken: post.accessToken,
                status: false
            };
        });
    }
    /*
    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        await pool.query('CALL DeleteCustomer(?)', [id]);
        if (customer== "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }
    */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield database_1.default.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_customer set ? WHERE id = ?', [req.body, id]);
            if (customer == "") {
                res.status(404).json({ text: "Customer doesn't exists" });
            }
            else {
                res.json({ message: 'The Customer was Update' });
            }
        });
    }
}
const Cinvoicecontroller = new CInvoiceController();
exports.default = Cinvoicecontroller;
