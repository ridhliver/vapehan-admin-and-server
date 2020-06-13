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
var nodemailer = require('nodemailer');
class DistributorController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield database_1.default.query('SELECT * FROM vh_distributor ORDER BY id DESC');
            res.json(customer);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const distributor = yield database_1.default.query('SELECT id FROM vh_distributor WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_distributor WHERE id = ?', [id]);
            if (distributor == "") {
                res.status(404).json({ text: "Distributor doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
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
    updateFlag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                flag_stat: req.body.flag
            };
            const distributor = yield database_1.default.query('SELECT id FROM vh_distributor WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_distributor set ? WHERE id = ?', [data, id]);
            if (distributor == "") {
                res.status(404).json({ text: "Distributor doesn't exists" });
            }
            else {
                res.json({ message: 'The Distributor was Update' });
            }
        });
    }
}
const distributorcontroller = new DistributorController();
exports.default = distributorcontroller;
