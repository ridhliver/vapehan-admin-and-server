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
class OngkirController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.body.code;
            const id = req.body.id_courier;
            const ongkir = yield database_1.default.query('SELECT * FROM vh_ongkir WHERE dest_code = ? AND id_courier = ?', [code, id]);
            // console.log(ongkir);
            res.json(ongkir);
        });
    }
    ongkir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const harga = yield database_1.default.query('SELECT * FROM vh_ongkir WHERE id = ? LIMIT 1', [id]);
            // console.log(harga);
            res.json(harga);
        });
    }
    orderOngkir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const shipping = yield database_1.default.query('SELECT * FROM vh_shipping WHERE id_order = ? LIMIT 1', [id]);
            // console.log(shipping);
            res.json(shipping[0]);
        });
    }
}
const ongkircontroller = new OngkirController();
exports.default = ongkircontroller;
