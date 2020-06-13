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
class CartController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield database_1.default.query('SELECT *, format(total,0) as harga FROM vh_cart');
            res.json(cart);
        });
    }
    updateqtyProductinc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cart = yield database_1.default.query('UPDATE vh_cart set quantity = quantity + 1 WHERE id = ?', [id]);
            res.json(cart[0]);
        });
    }
    updateqtyProductdec(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cart = yield database_1.default.query('UPDATE vh_cart set quantity = quantity - 1 WHERE id = ?', [id]);
            res.json(cart[0]);
        });
    }
    getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(id);
            const cart = yield database_1.default.query('select i.*, ("jne:jnt:tiki:ninja:sicepat") as courier, '+
            'if(i.totweight <= i.flag, round(i.totweight), ceil(i.totweight)) as totalweight '+
            'from '+
            '(SELECT x.*, (select param from vh_paramweight where param = x.totweight limit 1) as flag '+
            'from '+
            '( '+
            'SELECT a.id, b.stock, a.id_customer, b.name as prodName, b.nic, a.quantity as qty, a.harga as price, b.image, a.id_product, b.color, if(b.status = 1, true, false) as status, c.totalqty, c.total, c.totalOut, format(a.quantity * a.harga, 0) as harga, '+
            '(SELECT SUM(b.weight * a.quantity) as Weight FROM vh_cart a LEFT JOIN vh_product b on a.id_product = b.id WHERE a.id_customer = ? AND (a.id_order = "" OR a.id_order is null) AND b.status = 1 GROUP BY a.id_customer) as weight, '+ 
            'format((SELECT SUM((IF(b.weight <= 100, 100, b.weight)/1000) * a.quantity) as totalWeight FROM vh_cart a LEFT JOIN vh_product b on a.id_product = b.id WHERE a.id_customer = ? AND (a.id_order = "" OR a.id_order is null) AND b.status = 1 GROUP BY a.id_customer), 1) as totweight '+
            'FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id '+
            'LEFT JOIN (SELECT id_customer, SUM(quantity) as totalqty, format(SUM(quantity*harga),0) as total, SUM(quantity*harga) as totalOut '+
            'FROM vh_cart LEFT JOIN vh_product d ON id_product = d.id WHERE id_customer = ? AND (id_order = "" OR id_order is null) AND d.status = 1 GROUP BY id_customer) c ON a.id_customer = c.id_customer '+
            'WHERE a.id_customer = ? AND (a.id_order = "" OR a.id_order is null) AND b.status = 1 AND a.quantity > 0 '+
            ') x )i', [id, id, id, id]);
            res.json(cart);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cart = yield database_1.default.query('SELECT * FROM vh_cart WHERE id = ?', [id]);
            if (cart.length > 0) {
                return res.json(cart[0]);
            }
            res.status(404).json({ text: "Cart doesn't exists " });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO vh_cart set ?', [req.body]);
            res.json({ message: 'Success' });
        });
    }
    createCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const data = {
                id_customer: req.body.id_customer,
                id_product: req.body.id_product,
                quantity: req.body.quantity,
                harga: req.body.harga
            };
            // console.log(data);
            yield database_1.default.query('INSERT INTO vh_cart SET ?', [data]);
            yield database_1.default.query('UPDATE vh_cart a LEFT JOIN vh_product b on a.id_product = b.id set a.barcode = b.barcode where a.barcode is null');
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id = ?', [id]);
            yield database_1.default.query('DELETE FROM vh_cart WHERE id = ?', [id]);
            if (cart == "") {
                res.status(404).json({ text: "Cart doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cart = yield database_1.default.query('SELECT id_product FROM vh_cart WHERE id = ?', [id]);
            yield database_1.default.query('DELETE FROM vh_cart WHERE id = ?', [id]);
            if (cart == "") {
                res.status(404).json({ text: "Cart doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_cart set ? WHERE id = ?', [req.body, id]);
            if (cart == "") {
                res.status(404).json({ text: "Cart doesn't exists" });
            }
            else {
                res.json({ message: 'The Cart was Update' });
            }
        });
    }
}
const cartcontroller = new CartController();
exports.default = cartcontroller;
