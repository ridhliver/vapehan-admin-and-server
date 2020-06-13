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
class BrandController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield database_1.default.query('SELECT * FROM vh_product_brand');
            return res.json(brand);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const brand = yield database_1.default.query('SELECT * FROM vh_product_brand WHERE id = ?', [id]);
            if (brand.length > 0) {
                return res.json(brand[0]);
            }
            res.status(404).json({ text: "Brand doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO vh_product_brand set ? ', [req.body]);
            res.json({ message: 'Success' });
        });
    }
    newBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            yield database_1.default.query('INSERT INTO vh_product_brand set ? ', [req.body]);
            const newBrand = yield database_1.default.query('SELECT id, name FROM vh_product_brand WHERE id in (SELECT MAX(id) FROM vh_product_brand) LIMIT 1');
            res.json(newBrand);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const brand = yield database_1.default.query('SELECT id FROM vh_product_brand WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_product_brand WHERE id = ?', [id]);
            if (brand == "") {
                res.status(404).json({ text: "Brand doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const brand = yield database_1.default.query('SELECT id FROM vh_product_brand WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_product_brand set ? WHERE id = ?', [req.body, id]);
            if (brand == "") {
                res.status(404).json({ text: "Brand doesn't exists" });
            }
            else {
                res.json({ message: 'The Brand was Update' });
            }
        });
    }
}
const brandcontroller = new BrandController();
exports.default = brandcontroller;
