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
class NotifController {
    notifmd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;

            if (post.status_code === '201' || post.status_code === 201) {
                const pending = {
                    id_order: post.order_id,
                    transaction_id: post.transaction_id,
                    payment_type: post.payment_type,
                    transaction_time: post.transaction_time,
                    transaction_status: post.transaction_status,
                    sessionid: post.signature_key
                };
                
                yield database_1.default.query('UPDATE FROM vh_order WHERE sessionid = ?', [pending.sessionid]);

                res.json({ text: 'Payment Pending' });

            } else if (post.status_code === '200' || post.status_code === 200) {
                const settlement = {
                    id_order: post.order_id,
                    transaction_id: post.transaction_id,
                    payment_type: post.payment_type,
                    transaction_time: post.transaction_time,
                    transaction_status: post.transaction_status,
                    sessionid: post.signature_key
                };

                yield database_1.default.query('UPDATE vh_order SET sessionid = ?, status = 5 WHERE id_order = ?', [settlement.sessionid, settlement.id_order]);

                if (settlement.payment_type === 'gopay') {
                    yield database_1.default.query('UPDATE vh_gopay_tf SET transaction_status = ?, change_date = ? WHERE id_order = ?', [settlement.transaction_status, settlement.transaction_status, settlement.id_order]);
                } else if (settlement.payment_type === 'echannel' || settlement.payment_type === 'bank_transfer') {
                    yield database_1.default.query('UPDATE vh_bank_transfer SET transaction_status = ?, change_date = ? WHERE id_order = ?', [settlement.transaction_status, settlement.transaction_status, settlement.id_order]);
                } else if (settlement.payment_type === 'cstore') {
                    yield database_1.default.query('UPDATE vh_cstore SET transaction_status = ?, change_date = ? WHERE id_order = ?', [settlement.transaction_status, settlement.transaction_status, settlement.id_order]);
                } else if (settlement.payment_type === 'akulaku') {
                    yield database_1.default.query('UPDATE vh_akulaku SET transaction_status = ?, change_date = ? WHERE id_order = ?', [settlement.transaction_status, settlement.transaction_status, settlement.id_order]);
                }

                res.json({ text: 'Payment Success' });

                // Send Email
                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, a.email, b.nameReceive, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [settlement.id_order]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT b.name as payment, x.payment_code, x.status, x.create_at, x.payid, x.weight as totalWeight, x.voucherid, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, (z.totalHarga + y.ongkir + x.payid) as Amount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN vh_payment_list b ON x.payment = b.sku '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [settlement.id_order]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                            'FROM ' +
                            '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                            'LEFT JOIN ' +
                            '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                            'ON x.id_order = y.id_order', [settlement.id_order, settlement.id_order]);
                        const voucher = yield database_1.default.query('SELECT * FROM vh_voucher WHERE voucherid = ? LIMIT 1', [order[0].voucherid]);
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
                                defaultLayout: 'payment-accept',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = +order[0].Amount - +order[0].payid;
                        let potongan = 0;

                        if (order[0].voucherid) {
                            if (voucher[0].vouchertab === 'Amount') {
                                potongan = voucher[0].vouchervalue;
                            } else {
                                potongan = ( +amount * voucher[0].vouchervalue ) / 100;
                            }
                        }
                let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                            weightg = true;
                        }
                        // console.log(voucher[0].vouchertab);
                        // send mail with defined transport object

                        var cclist = [
                            'vapehan@gmail.com',
                            'sales@vapehan.com',
                            'admin@vapehan.com',
                        ];

                        cclist.toString();

                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: customer[0].email,
                            // cc: cclist,
                            subject: 'Payment Accepted Vapehan',
                            template: 'payment-accept',
                            context: {
                                imgUrl: 'http://192.168.1.160:4000/',
                                orderId: settlement.id_order,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                voucher: order[0].voucherid,
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                customer: customer[0],
                                virtual: order[0].payment_code,
                                payment: order[0].payment,
                                date: dateFormat(new Date(), "dd-mmmm-yyyy h:MM:ss TT"),
                                weightkg: weightkg,
                                weightg: weightg,
                                year: new Date().getFullYear()
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
            } else if (post.status_code === '202' || post.status_code === 202) {
                const expired = {
                    id_order: post.order_id,
                    transaction_id: post.transaction_id,
                    payment_type: post.payment_type,
                    transaction_time: post.transaction_time,
                    transaction_status: post.transaction_status,
                    sessionid: post.signature_key
                };

                yield database_1.default.query('UPDATE vh_order SET sessionid = ?, status = 6 WHERE id_order = ?', [expired.sessionid, expired.id_order]);

                if (expired.payment_type === 'gopay') {
                    yield database_1.default.query('UPDATE vh_gopay_tf SET transaction_status = ?, change_date = ? WHERE id_order = ?', [expired.transaction_status, expired.transaction_status, expired.id_order]);
                } else if (expired.payment_type === 'echannel' || expired.payment_type === 'bank_transfer') {
                    yield database_1.default.query('UPDATE vh_bank_transfer SET transaction_status = ?, change_date = ? WHERE id_order = ?', [expired.transaction_status, expired.transaction_status, expired.id_order]);
                } else if (expired.payment_type === 'cstore') {
                    yield database_1.default.query('UPDATE vh_cstore SET transaction_status = ?, change_date = ? WHERE id_order = ?', [expired.transaction_status, expired.transaction_status, expired.id_order]);
                } else if (expired.payment_type === 'akulaku') {
                    yield database_1.default.query('UPDATE vh_akulaku SET transaction_status = ?, change_date = ? WHERE id_order = ?', [expired.transaction_status, expired.transaction_status, expired.id_order]);
                }

                res.json({ text: 'Payment Expired' });
            } 
        });
    }
}
const notifcontroller = new NotifController();
exports.default = notifcontroller;
