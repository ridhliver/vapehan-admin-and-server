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
class DeliveryController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const delivery = yield database_1.default.query('SELECT resi, status FROM vh_shipping');
            res.json(delivery);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const delivery = yield database_1.default.query('SELECT * FROM vh_order WHERE id_customer = ?', [id]);
            if (delivery.length > 0) {
                return res.json(delivery);
            }
            res.status(404).json({ text: "Delivery doesn't exists " });
        });
    }
    shipping(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const shipping = yield database_1.default.query('SELECT * FROM vh_shipping WHERE id_order = ?', [id]);
            if (shipping.length > 0) {
                return res.json(shipping[0]);
            }
            res.status(404).json({ text: "Delivery doesn't exists " });
        });
    }
    /*
    public async orderDetail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const delivery =  await pool.query('SELECT *, format(total,0) as harga FROM vh_order WHERE id_order = ?', [id]);
        if (delivery.length > 0) {
            return res.json(delivery[0]);
        }
        res.status(404).json({text: "Delivery doesn't exists"})
    }
    */
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const delivery = {
                resi: req.body.rest,
                // id_ongkir: req.body.id_ongkir,
                id_order: req.body.id_order,
                id_invoice: req.body.id_invoice,
                // id_customer: req.body.id_customer
                status: 0
            };
            const status = {
                status: req.body.status
            };
            // console.log(delivery);
            yield database_1.default.query('INSERT INTO vh_shipping set ?', delivery);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id_order = ?', [status, req.body.id_order]);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const delivery = yield database_1.default.query('SELECT id FROM vh_order WHERE id = ?', [id]);
            yield database_1.default.query('DELETE vh_order, vh_cart FROM vh_order INNER JOIN vh_cart ON vh_order.id_order = vh_cart.id_order WHERE vh_order.id = ?', [id]);
            if (delivery == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const delivery = yield database_1.default.query('SELECT id FROM vh_order WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id = ?', [req.body, id]);
            if (delivery == "") {
                res.status(404).json({ text: "Delivery doesn't exists" });
            }
            else {
                res.json({ message: 'The Delivery was Update' });
            }
        });
    }
    Done(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = {
                status: req.body.order
            };
            const shipping = {
                status: req.body.shipping
            };
            const delivery = yield database_1.default.query('SELECT id_order FROM vh_shipping WHERE id_order = ?', [id]);
            yield database_1.default.query('UPDATE vh_shipping set ? WHERE id_order = ?', [shipping, id]);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id_order = ?', [order, id]);
            if (delivery == "") {
                res.status(404).json({ text: "Delivery doesn't exists" });
            }
            else {
                res.json({ message: 'The Delivery was Update' });
            }
        });
    }
}
const deliverycontroller = new DeliveryController();
exports.default = deliverycontroller;
