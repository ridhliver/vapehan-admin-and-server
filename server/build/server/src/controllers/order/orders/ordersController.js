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
const express_1 = require("express");
const database_1 = __importDefault(require("../../../database"));
var dateFormat = require('dateformat');
var globarUrl = '192.168.1.160:4000';
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
class OrderController {
    constructor() {
        this.router = express_1.Router();
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield database_1.default.query('SELECT id, id_order, payment, status, create_at, ' +
                '(SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = a.id_customer LIMIT 1) as customerName, ' +
                '(SELECT format(SUM(quantity * harga) + (SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) + a.payid, 0) FROM vh_cart ' + 'WHERE id_order = a.id_order GROUP BY id_order) as total ' +
                'FROM vh_order a');
            res.json(order);
        });
    }
    parameterStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('');
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
            const status = req.body.meter;
            const order = yield database_1.default.query('SELECT id_order, create_at, exp_date, status, payment, weight, ' +
                '(SELECT name FROM vh_courier WHERE id in (SELECT id_courier FROM vh_ongkir WHERE id = a.id_ongkir) LIMIT 1) as namaongkir, ' +
                '(SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) as ongkir, ' +
                '(SELECT invoice FROM vh_invoice WHERE id_order = a.id_order LIMIT 1) as invoiceid, ' +
                '(SELECT resi FROM vh_shipping WHERE id_order = a.id_order LIMIT 1) as resiid, ' +
                '(SELECT format(SUM(quantity * harga) + (SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) + a.payid, 0) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) as total, ' +
                '(SELECT status FROM vh_confirm_order where transaction_id = a.id_order LIMIT 1) as statusconfirm, ' +
                '(SELECT cod FROM vh_order where id_order = a.id_order LIMIT 1) as statuscod ' +
                'FROM vh_order a WHERE a.id_customer = ? AND a.status = ? ORDER BY a.id DESC', [id, status]);
            if (order.length > 0) {
                return res.json(order);
            }
            res.status(404).json({ text: "Order doesn't exists " });
        });
    }
    getProductCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT x.id_order, x.id_product, x.nic, x.color, x.name, x.image, x.quantity, format(x.harga, 0) as price, format((x.quantity * x.harga), 0) as subtotal, y.sumqty, y.total, format(c.totalOngkir,0) as ongkir, c.weight FROM (SELECT a.id_order, a.id_product, b.name, b.nic, b.color, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x LEFT JOIN (SELECT id_order, sum(quantity)as sumqty, format(SUM(quantity * harga),0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ON x.id_order = y.id_order LEFT JOIN vh_order c ON x.id_order = c.id_order', [id, id]);
            if (product.length > 0) {
                return res.json(product);
            }
            res.status(404).json({ text: "Order doesn't exists" });
        });
    }
    getProductCartTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT weight * (SELECT ongkir FROM vh_ongkir WHERE id = a.id_ongkir LIMIT 1) as ongkir FROM vh_order a WHERE a.id_order = ?', [id]);
            if (product.length > 0) {
                return res.json(product);
            }
            res.status(404).json({ text: "Order doesn't exists" });
        });
    }
    orderHeaderA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT x.id_order, x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, ' +
                '(SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = x.id_customer LIMIT 1) as customerName, ' +
                'y.jenis, y.totalOngkir, y.courierName, z.totalAmount ' +
                'FROM vh_order x ' +
                'LEFT JOIN ' +
                '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, c.name as courierName ' +
                'FROM vh_order a ' +
                'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id ' +
                'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order ' +
                'LEFT JOIN ' +
                '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount FROM vh_cart GROUP BY id_order) z ON x.id_order =  ' + 'z.id_order ' +
                'WHERE x.id_order = ?', [id]);
            if (order.length > 0) {
                return res.json(order[0]);
            }
            res.status(404).json({ text: "Order doesn't exists" });
        });
    }
    orderHeaderB(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, a.create_at, b.phone, b.address, ' +
                'b.id_province, b.id_city, b.id_district, postal ' +
                'FROM vh_customer a ' +
                'LEFT JOIN vh_customer_info b ' +
                'ON a.id = b.id_customer ' +
                'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
            if (order.length > 0) {
                return res.json(order[0]);
            }
            res.status(404).json({ text: "Order doesn't exists" });
        });
    }
    orderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT x.id, x.id_order, x.id_product, x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, y.total, format(x.harga * x.quantity, 0) as subTotal ' +
                'FROM ' +
                '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                'LEFT JOIN ' +
                '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                'ON x.id_order = y.id_order', [id, id]);
            if (order.length > 0) {
                return res.json(order);
            }
            res.status(404).json({ text: "Order doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date;
            currentDate.setDate(currentDate.getDate() + 1);
            if (req.body.payment.service === 1) {
                const order = {
                    id_order: req.body.orderId,
                    id_customer: req.body.shippingDetails.id_customer,
                    id_ongkir: req.body.payment.service,
                    weight: req.body.payment.weight,
                    // total: req.body.totalAmount,
                    payment: req.body.payment.payment,
                    status: 0,
                    cod: 0,
                    exp_date: currentDate,
                    payid: req.body.payid,
                    totalOngkir: 0
                };
                // console.log(order);
                for (let i = 0; i < req.body.product.length; i++) {
                    const cart = {
                        id_order: req.body.orderId,
                    };
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.orderId, req.body.product[i].id]);
                    yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.product[i].qty, req.body.product[i].id_product]);
                }
                const date = dateFormat(new Date(), "yyyyMMdd");
                yield database_1.default.query('INSERT INTO vh_order set ?', order);
                res.json({ message: 'Success' });
            }
            else {
                const order = {
                    id_order: req.body.orderId,
                    id_customer: req.body.shippingDetails.id_customer,
                    id_ongkir: req.body.payment.service,
                    weight: req.body.payment.weight,
                    // total: req.body.totalAmount,
                    payment: req.body.payment.payment,
                    status: 0,
                    exp_date: currentDate,
                    payid: req.body.payid,
                    totalOngkir: req.body.totalOngkir
                };
                const notif = {
                    id_order: req.body.orderId,
                    flag: false
                };
                // console.log(order);
                for (let i = 0; i < req.body.product.length; i++) {
                    const cart = {
                        id_order: req.body.orderId,
                    };
                    const id = {
                        id: req.body.product[i].id
                    };
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.orderId, req.body.product[i].id]);
                    yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.product[i].qty, req.body.product[i].id_product]);
                }
                yield database_1.default.query('INSERT INTO vh_order set ?', order);
                yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                res.json({ message: 'Success' });
            }
            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [req.body.orderId]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, ' +
                        'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total ' +
                        'FROM vh_order x ' +
                        'LEFT JOIN ' +
                        '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName ' +
                        'FROM vh_order a ' +
                        'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id ' +
                        'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  ' + 'z.id_order ' +
                        'WHERE x.id_order = ?', [req.body.orderId]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [req.body.orderId, req.body.orderId]);
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'in-v3.mailjet.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                            pass: 'b03e8e328002d108907a62fb7d2ea2fb'
                        }
                    });
                    const handlebarOptions = {
                        viewEngine: {
                            partialsDir: './views/',
                            layoutsDir: './views/',
                            defaultLayout: 'order-detail',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: req.body.shippingDetails.email,
                        subject: 'Checkout Order Detail',
                        template: 'order-detail',
                        context: {
                            imgUrl: globarUrl,
                            orderId: req.body.orderId,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            virtual: '3124678649',
                            custProv: req.body.address.province,
                            custCity: req.body.address.city,
                            cutDistrik: req.body.address.subdistrict_name
                        }
                    });
                    console.log('Message sent: %s', info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }
            main().catch(console.error);
        });
    }
    resendemailOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, ' +
                        'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total ' +
                        'FROM vh_order x ' +
                        'LEFT JOIN ' +
                        '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName ' +
                        'FROM vh_order a ' +
                        'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id ' +
                        'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  ' + 'z.id_order ' +
                        'WHERE x.id_order = ?', [id]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [id, id]);
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'in-v3.mailjet.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                            pass: 'b03e8e328002d108907a62fb7d2ea2fb'
                        }
                    });
                    const handlebarOptions = {
                        viewEngine: {
                            partialsDir: './views/',
                            layoutsDir: './views/',
                            defaultLayout: 'order-detail',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: customer[0].email,
                        subject: 'Checkout Order Detail',
                        template: 'order-detail',
                        context: {
                            imgUrl: globarUrl,
                            orderId: id,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            virtual: '3124678649',
                            custProv: req.body.address.province,
                            custCity: req.body.address.city,
                            cutDistrik: req.body.address.subdistrict_name
                        }
                    });
                    console.log('Message sent: %s', info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }
            main().catch(console.error);
            res.json({ text: 'Success' });
        });
    }
    sendInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, ' +
                        'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total ' +
                        'FROM vh_order x ' +
                        'LEFT JOIN ' +
                        '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName ' +
                        'FROM vh_order a ' +
                        'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id ' +
                        'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  ' + 'z.id_order ' +
                        'WHERE x.id_order = ?', [id]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [id, id]);
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'in-v3.mailjet.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                            pass: 'b03e8e328002d108907a62fb7d2ea2fb'
                        }
                    });
                    const handlebarOptions = {
                        viewEngine: {
                            partialsDir: './views/',
                            layoutsDir: './views/',
                            defaultLayout: 'invoice-order',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: customer[0].email,
                        subject: 'Invoice Order',
                        template: 'invoice-order',
                        context: {
                            imgUrl: globarUrl,
                            invoice: req.body.orders.invoiceid,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            custProv: req.body.address.province,
                            custCity: req.body.address.city,
                            cutDistrik: req.body.address.subdistrict_name,
                            date: dateFormat(order[0].create_at, "dd mmmm yyyy")
                        }
                    });
                    console.log('Message sent: %s', info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }
            main().catch(console.error);
            res.json({ text: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order = ? LIMIT 1', [id]);
            yield database_1.default.query('UPDATE vh_order SET status = 6 WHERE id_order = ?', [id]);
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
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT id FROM vh_order WHERE id_order = ?', [id]);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id_order = ?', [req.body, id]);
            if (order == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ message: 'The Order was Update' });
            }
        });
    }
    accPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT id FROM vh_order WHERE id_order = ?', [id]);
            yield database_1.default.query('UPDATE vh_order set ? WHERE id_order = ?', [req.body, id]);
            if (order == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ message: 'The Order was Update' });
            }
            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, ' +
                        'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total ' +
                        'FROM vh_order x ' +
                        'LEFT JOIN ' +
                        '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName ' +
                        'FROM vh_order a ' +
                        'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id ' +
                        'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  ' + 'z.id_order ' +
                        'WHERE x.id_order = ?', [id]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [id, id]);
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'in-v3.mailjet.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                            pass: 'b03e8e328002d108907a62fb7d2ea2fb'
                        }
                    });
                    const handlebarOptions = {
                        viewEngine: {
                            partialsDir: './views/',
                            layoutsDir: './views/',
                            defaultLayout: 'payment-accept',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: customer[0].email,
                        subject: 'Payment Accepted',
                        template: 'payment-accept',
                        context: {
                            imgUrl: 'http://192.168.1.160:4000/',
                            orderId: id,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            virtual: '3124678649',
                            date: dateFormat(new Date(), "dd-mmmm-yyyy")
                        }
                    });
                    console.log('Message sent: %s', info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }
            main().catch(console.error);
        });
    }
}
const ordercontroller = new OrderController();
exports.default = ordercontroller;
