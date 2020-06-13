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
const hbs = require('nodemailer-express-handlebars');
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

            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, b.nameReceive, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                    'FROM vh_customer a ' +
                    'LEFT JOIN vh_customer_info b ' +
                    'ON a.id = b.id_customer ' +
                    'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                    'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [req.body.id_order]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT (SELECT name FROM vh_payment_type where id = x.payment LIMIT 1) as payment, x.payment_code, x.status, x.create_at, x.payid, x.weight as totalWeight, x.voucherid, y.resi, y.invoice, '+
                    'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, (z.totalHarga + y.ongkir + x.payid) as Amount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                    'FROM vh_order x '+
                    'LEFT JOIN '+
                    '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier, (SELECT resi FROM vh_shipping where id_order = a.id_order LIMIT 1) as resi, (SELECT invoice FROM vh_invoice WHERE id_order = a.id_order limit 1) as invoice '+
                    'FROM vh_order a) y ON x.id_order = y.id_order '+
                    'LEFT JOIN '+
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                    'WHERE x.id_order = ?', [req.body.id_order]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [req.body.id_order, req.body.id_order]);
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
                            defaultLayout: 'sending',
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
                    let paymentcode = '';
                    switch(order[0].payment) {
                        case '41':
                            paymentcode = 'Mandiri VA';
                        break;
                        case '15':
                            paymentcode = 'Credit Card Visa/Master/JCB';
                        break;
                        case '16':
                            paymentcode = 'Credit Cart';
                        break;
                        case '04':
                            paymentcode = 'Doku Wallet';
                        break;
                        case '33':
                            paymentcode = 'Danamon VA';
                        break;
                        case '32':
                            paymentcode = 'CIMB VA';
                        break;
                        case '26':
                            paymentcode = 'Danamon Internet Banking';
                        break;
                        case '25':
                            paymentcode = 'Muamalat Internet Banking';
                        break;
                        case '19':
                            paymentcode = 'CIMB Clicks';
                        break;
                        case '35':
                            paymentcode = 'Alfa VA';
                        break;
                        case '01':
                            paymentcode = 'BCA Transfer';
                        break;
                      }
                    // console.log(voucher[0].vouchertab);
                    // send mail with defined transport object

                    var cclist = [
                        'vapehan@gmail.com',
                        'shop@vapehan.com',
                        'sales@vapehan.com',
                    ];

                    cclist.toString();

                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <system@vapehan.com>',
                        to: 'ridhobagaskara68@gmail.com',
                        // cc: cclist,
                        subject: `Pesanan ${order[0].invoice} sedang di kirim`,
                        template: 'sending',
                        context: {
                            // imgUrl: 'http://192.168.1.160:4000/',
                            // orderId: id,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            voucher: order[0].voucherid,
                            discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                            amountVoucher: order[0].amounv,
                            customer: customer[0],
                            virtual: order[0].payment_code,
                            payment: order[0].payment,
                            // date: dateFormat(new Date(), "dd-mmmm-yyyy"),
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

            let adminName = '';

            if (!req.body.ad || req.body.ad === undefined || req.body.ad === null) {
                adminName = 'System'
            } else {
                adminName = req.body.ad
            }

            const order = {
                status: req.body.order,
                change_by: adminName
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
