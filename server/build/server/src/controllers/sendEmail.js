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
const database_1 = __importDefault(require("./../database"));
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
class SendEmailController {
    index(req, res) {
        // async..await is not allowed in global scope, must use a wrapper
        function main() {
            return __awaiter(this, void 0, void 0, function* () {
                const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal ' +
                    'FROM vh_customer a ' +
                    'LEFT JOIN vh_customer_info b ' +
                    'ON a.id = b.id_customer ' +
                    'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', ['WLVG9HNC']);
                const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, ' +
                    'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY ' +
                    'FROM vh_order x ' +
                    'LEFT JOIN ' +
                    '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, c.name as courierName ' +
                    'FROM vh_order a ' +
                    'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id ' +
                    'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order ' +
                    'LEFT JOIN ' +
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  ' + 'z.id_order ' +
                    'WHERE x.id_order = ?', ['WLVG9HNC']);
                const cart = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                    'FROM ' +
                    '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                    'LEFT JOIN ' +
                    '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                    'ON x.id_order = y.id_order', ['WLVG9HNC', 'WLVG9HNC']);
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
                        defaultLayout: 'index',
                    },
                    viewPath: './views/',
                };
                transporter.use('compile', hbs(handlebarOptions));
                // send mail with defined transport object
                let info = yield transporter.sendMail({
                    from: '"Vapehan Store" <shop@vapehan.com>',
                    to: 'ridhliver1@gmail.com',
                    subject: 'Order Detail',
                    template: 'index',
                    context: {
                        orderId: 'WLVG9HNC',
                        cart: cart
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
}
exports.sendemailontroller = new SendEmailController();
