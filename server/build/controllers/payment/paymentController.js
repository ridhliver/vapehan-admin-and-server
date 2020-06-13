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
var schedule = require('node-schedule');
var dateFormat = require('dateformat');
var globarUrl = '192.168.1.160:4000';
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
var rule = new schedule.RecurrenceRule();
class PaymentController {
    getPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const payment = yield database_1.default.query('SELECT a.id_order, d.id as id_customer, d.accessToken, a.payment_code, if(a.amountvoucher is null OR a.amountvoucher = "", a.amount, a.amountvoucher) as harga_barang, a.totalOngkir, a.layanan, a.payid, if(a.amountvoucher is null OR a.amountvoucher = "", a.amount + a.totalOngkir + if(a.payid is null OR a.payid = "", a.layanan, a.payid), a.amountvoucher + if(a.payid is null OR a.payid = "", a.layanan, a.payid)) as amount_pay, b.gross_amount as gopay_total, DATE_FORMAT(a.exp_date, "%d %M %Y %H:%i:%S") as exp_date, c.sku, c.name, c.image, b.generate_qr_code, b.deeplink_redirect, b.get_status, b.cancel, e.gross_amount as bank_total, a.payment_code as va, f.redirect_url  '+
            'FROM vh_order a '+
            'LEFT JOIN vh_gopay_tf b ON a.id_order = b.id_order '+
            'LEFT JOIN vh_bank_transfer e ON a.id_order = e.id_order '+
            'LEFT JOIN vh_payment_list c ON a.payment = c.sku '+
            'LEFT JOIN vh_customer d ON a.id_customer = d.id '+
            'LEFT JOIN vh_akulaku f ON a.id_order = f.id_order '+
            'WHERE a.id_order = ? AND a.status = 0', [id]);
            res.json(payment[0]);
        });
    }
    resgopay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);
        
                const gopay = {
                    id_order: post.ID,
                    transaction_id: post.TID,
                    gross_amount: post.GA,
                    transaction_time: post.TT,
                    transaction_status: post.TS,
                    generate_qr_code: post.QR,
                    deeplink_redirect: post.DL,
                    get_status: post.GS,
                    cancel: post.CL
                };

                yield database_1.default.query('INSERT into vh_gopay_tf set ?', [gopay]);

                const expdate = new Date();
                expdate.setMinutes(expdate.getMinutes() + 15);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                payment_code: post.TID,
                status: 0,
                stat_pay: post.TS,
                exp_date: expdate,
                amount: tempo[0].amount,
                layanan: post.PS,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);
                        const gopay = yield database_1.default.query('SELECT *, format(gross_amount, 0) as  total FROM vh_gopay_tf WHERE id_order = ? ORDER BY id desc limit 1', [post.ID]);
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-gopay',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-gopay',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: gopay[0]
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
    resmandiriVA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);
        
                const mandiriVA = {
                    id_order: post.ID,
                    transaction_id: post.TID,
                    gross_amount: post.GA,
                    payment_type: post.PT,
                    transaction_time: post.TT,
                    transaction_status: post.TS,
                    fraud_status: post.FS,
                    bill_key: post.BK,
                    biller_code: post.BC,
                    currency: post.CY, 
                    name: 'Mandiri VA'
                };

                yield database_1.default.query('INSERT into vh_bank_transfer set ?', [mandiriVA]);

                const expdate = new Date();
                expdate.setDate(expdate.getDate() + 1);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                payment_code: post.BC.toString() + "-" + post.BK.toString(),
                status: 0,
                stat_pay: post.TS,
                exp_date: expdate,
                amount: tempo[0].amount,
                layanan: post.PS,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.payment_code, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);
                        const bank = yield database_1.default.query('SELECT *, format(gross_amount, 0) as total FROM vh_bank_transfer WHERE id_order = ? ORDER BY id desc limit 1', [post.ID]);
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-bank',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-bank',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: bank[0]
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
    resbca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.payid, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);

                const expdate = new Date();
                expdate.setDate(expdate.getDate() + 1);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                status: 0,
                exp_date: expdate,
                amount: tempo[0].amount,
                payid: tempo[0].payid,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);

                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-bank-transfer',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-bank-transfer',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: '2302112658 | Lee Handoko'
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
    resalfaVA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);
        
                const alfaVA = {
                    id_order: post.ID,
                    transaction_id: post.TID,
                    gross_amount: post.GA,
                    payment_type: post.PT,
                    transaction_time: post.TT,
                    transaction_status: post.TS,
                    fraud_status: post.FS,
                    payment_code: post.PC,
                    store: post.ST
                };

                yield database_1.default.query('INSERT into vh_cstore set ?', [alfaVA]);

                const expdate = new Date();
                expdate.setDate(expdate.getDate() + 1);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                payment_code: post.PC.toString(),
                status: 0,
                stat_pay: post.TS,
                exp_date: expdate,
                amount: tempo[0].amount,
                layanan: post.PS,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);
                        const cstore = yield database_1.default.query('SELECT *, format(gross_amount, 0) as total FROM vh_cstore WHERE id_order = ? ORDER BY id desc limit 1', [post.ID]);
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-cstore',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-cstore',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: cstore[0]
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
    respermataVA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);
        
                const permataVA = {
                    id_order: post.ID,
                    transaction_id: post.TID,
                    gross_amount: post.GA,
                    payment_type: post.PT,
                    transaction_time: post.TT,
                    transaction_status: post.TS,
                    fraud_status: post.FS,
                    va_number: post.VA,
                    name: 'Permata VA'
                };

                yield database_1.default.query('INSERT into vh_bank_transfer set ?', [permataVA]);

                const expdate = new Date();
                expdate.setDate(expdate.getDate() + 1);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                payment_code: post.VA,
                status: 0,
                stat_pay: post.TS,
                exp_date: expdate,
                amount: tempo[0].amount,
                layanan: post.PS,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.payment_code, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);
                        const bank = yield database_1.default.query('SELECT format(gross_amount, 0) as total, name FROM vh_bank_transfer WHERE id_order = ? ORDER BY id desc limit 1', [post.ID]);
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-bank',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-bank',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: bank[0]
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
    resbniVA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);
        
                const bniVA = {
                    id_order: post.ID,
                    transaction_id: post.TID,
                    gross_amount: post.GA,
                    payment_type: post.PT,
                    transaction_time: post.TT,
                    transaction_status: post.TS,
                    fraud_status: post.FS,
                    va_number: post.VA,
                    name: 'BNI VA'
                };

                yield database_1.default.query('INSERT into vh_bank_transfer set ?', [bniVA]);

                const expdate = new Date();
                expdate.setDate(expdate.getDate() + 1);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                payment_code: post.VA,
                status: 0,
                stat_pay: post.TS,
                exp_date: expdate,
                amount: tempo[0].amount,
                layanan: post.PS,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.payment_code, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);
                        const bank = yield database_1.default.query('SELECT format(gross_amount, 0) as total, name FROM vh_bank_transfer WHERE id_order = ? ORDER BY id desc limit 1', [post.ID]);
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-bank',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-bank',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: bank[0]
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
    resakulaku(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const post = req.body;

            try {

                yield database_1.default.query('UPDATE vh_order_tempo SET status = 1 WHERE id_order = ? AND id_customer = ?', [post.ID, post.CS.accessToken]);

                const tempo = yield database_1.default.query('SELECT a.id_order, b.accessToken, b.id as id_customer, a.courier, a.courier_service, a.weight, a.amount, a.totalOngkir, a.voucherid, a.amountvoucher '+
                'FROM vh_order_tempo a '+
                'LEFT JOIN vh_customer b '+
                'ON a.id_customer = b.accessToken '+
                'WHERE id_order = ? AND id_customer = ? '+
                'ORDER BY a.id DESC LIMIT 1', [post.ID, post.CS.accessToken]);
        
                const akulaku = {
                    id_order: post.ID,
                    transaction_id: post.TID,
                    redirect_url: post.RU,
                    gross_amount: post.GA,
                    currency: post.CR,
                    payment_type: post.PT,
                    transaction_time: post.TT,
                    transaction_status: post.TS,
                    fraud_status: post.FS,
                };

                yield database_1.default.query('INSERT into vh_akulaku set ?', [akulaku]);

                const expdate = new Date();
                expdate.setDate(expdate.getDate() + 1);

                const order = {
                id_order: tempo[0].id_order,
                id_customer: tempo[0].id_customer,
                courier: tempo[0].courier,
                courier_service: tempo[0].courier_service,
                weight: tempo[0].weight,
                payment: post.PAY,
                payment_code: post.TID,
                status: 0,
                stat_pay: post.TS,
                exp_date: expdate,
                amount: tempo[0].amount,
                layanan: post.PS,
                totalOngkir: tempo[0].totalOngkir,
                voucherid: tempo[0].voucherid,
                amountvoucher: tempo[0].amountvoucher
                };

                const notif = {
                    id_order: tempo[0].id_order,
                    flag: false
                };
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [post.ID]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [post.ID]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                const cart = yield database_1.default.query('SELECT id FROM vh_cart WHERE id_customer = ? AND tempo = 0', [tempo[0].id_customer]);

                for (let i = 0; i < cart.length; i++) {
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ?, tempo = 1 WHERE id = ?', [tempo[0].id_order, cart[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }

                const currentDate = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + tempo[0].id_order,
                    id_order: tempo[0].id_order,
                    create_at: currentDate
                };

                yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);

                res.json({ message: 'Success' });

                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.ID]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.payment_code, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, DATE_FORMAT(x.exp_date, "%d %M %Y %H %i %p") as exp_date, format(x.layanan, 0) as layanan, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [post.ID]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.ID, post.ID]);
                        const akulaku = yield database_1.default.query('SELECT format(gross_amount, 0) as total, redirect_url FROM vh_akulaku WHERE id_order = ? ORDER BY id desc limit 1', [post.ID]);
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'in-v3.mailjet.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: '0e4bed1f5c9aca6cd09e4048c2b1b179',
                                pass: '4e3019cd16e5172ae8f42e91b02cc05d'
                            }
                        });
                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: './views/',
                                layoutsDir: './views/',
                                defaultLayout: 'order-detail-akulaku',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = tempo[0].amount + tempo[0].totalOngkir;
                        let potongan;
                        potongan = 0;
                        
                        let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                        weightg = true;
                        }
                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail-akulaku',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: post.ID,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                payment: akulaku[0]
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
            }
            catch(err) {
                console.error(err);
            }
        });
    }
}
const paymentcontroller = new PaymentController();
exports.default = paymentcontroller;
