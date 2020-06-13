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
class OrderController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield database_1.default.query('SELECT *, format(total,0) as harga FROM vh_order');
            res.json(order);
        });
    }
    Imagelist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT * FROM vh_order_image WHERE id_order = ?', [id]);
            res.json(order);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT * FROM vh_order WHERE id_customer = ?', [id]);
            if (order.length > 0) {
                return res.json(order);
            }
            res.status(404).json({ text: "Order doesn't exists " });
        });
    }
    orderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT *, format(total,0) as harga FROM vh_order WHERE id_order = ?', [id]);
            if (order.length > 0) {
                return res.json(order[0]);
            }
            res.status(404).json({ text: "Order doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date;
            currentDate.setDate(currentDate.getDate() + 1);
            const order = {
                id_order: req.body.orderId,
                id_customer: req.body.shippingDetails.id_customer,
                id_ongkir: req.body.payment.service,
                weight: req.body.payment.weight,
                total: req.body.totalAmount,
                payment: req.body.payment.payment,
                status: 0,
                exp_date: currentDate
            };
            // console.log(order);
            for (let i = 0; i < req.body.product.length; i++) {
                const cart = {
                    id_order: req.body.orderId,
                    id_product: req.body.product[i].product.id,
                    quantity: req.body.product[i].quantity,
                    harga: req.body.product[i].product.price * req.body.product[i].quantity
                };
                // console.log(cart);
                yield database_1.default.query('INSERT INTO vh_cart set ?', cart);
            }
            yield database_1.default.query('INSERT INTO vh_order set ?', order);
            res.json({ message: 'Success' });
        });
    }
    /*
    public async confirm(req: Request, res: Response): Promise<void> {
        const confirm = {
            transaction_id: req.body.transaction_id,
            total_amount: req.body.total_amount,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            date_payment: req.body.date_payment,
            payment: req.body.payment,
            virtual_account: req.body.virtual_account,
            note: req.body.note
        }
        console.log(confirm);
        await pool.query('INSERT INTO vh_confirm_order set ?', confirm);
        res.json({message: 'Success'});
    }
    */
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT id FROM vh_order WHERE id = ?', [id]);
            yield database_1.default.query('DELETE vh_order, vh_cart FROM vh_order INNER JOIN vh_cart ON vh_order.id_order = vh_cart.id_order WHERE vh_order.id = ?', [id]);
            if (order == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    deleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const image = yield database_1.default.query('SELECT id FROM vh_order_image WHERE id = ?', [id]);
            yield database_1.default.query('DELETE FROM vh_order_image WHERE id = ?', [id]);
            if (image == "") {
                res.status(404).json({ text: "Order image doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT id FROM vh_order WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id = ?', [req.body, id]);
            if (order == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ message: 'The Order was Update' });
            }
        });
    }
}
const ordercontroller = new OrderController();
exports.default = ordercontroller;
