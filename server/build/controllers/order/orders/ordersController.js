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
            const order = yield database_1.default.query(
            'SELECT a.id as no, a.id_order, (SELECT name FROM vh_payment_type c WHERE a.payment = c.id) as payment, a.status, DATE_FORMAT(a.create_at,"%d-%m-%Y %T") as create_at, DATE_FORMAT(a.payDate,"%d-%m-%Y %T") as payDate, a.voucherid, format(a.amountvoucher + a.payid, 0) as amountv, '+
			'case when a.courier = "SiCepat Express" then "SiCepat"  '+
			'when a.courier = "J&T Express" then "J&T" '+
			'when a.courier = "Ninja Xpress" then "Ninja" '+ 
			'when a.courier = "Jalur Nugraha Ekakurir (JNE)" then "JNE" '+
            'when a.courier = "Citra Van Titipan Kilat (TIKI)" then "TIKI" '+
            'when a.courier = "JNE" then "JNE" '+
            'end as courier, '+

                'case when b.vouchertab = "Amount" then format(b.vouchervalue, 0) '+
                'when b.vouchertab = "Percent" then format((SELECT SUM(quantity * harga) + a.totalOngkir FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) * (b.vouchervalue * 0.01), 0) '+
                'end as harga_disc, '+
                '(SELECT CONCAT(firstname," ",if (lastname is null, "", lastname)) FROM vh_customer WHERE id = a.id_customer LIMIT 1) as customerName, '+
                '(SELECT nameReceive FROM vh_customer_info WHERE id_customer = a.id_customer LIMIT 1) as nameReceive, '+
				'(SELECT reminder FROM vh_customer_info WHERE id_customer = a.id_customer LIMIT 1) as phone, '+
                '(SELECT format(SUM(quantity * harga) + a.totalOngkir + a.payid, 0) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) as total '+
                'FROM vh_order a '+
								'LEFT JOIN vh_voucher b ON a.voucherid = b.voucherid ORDER BY a.flag asc, no desc');
            
            let orderJson = [];
            // console.log(order);

            for (let i = 0; i < order.length; i++) {
                const order_data = {
                    id: [i],
                    no: order[i].no,
                    id_order: order[i].id_order,
                    payment: order[i].payment,
                    status: order[i].status,
                    create_at: order[i].create_at,
                    editDate: order[i].payDate,
                    voucherid: order[i].voucherid,
                    amountv: order[i].amountv,
                    courier: order[i].courier,
                    harga_disc: order[i].harga_disc,
                    customerName: order[i].customerName,
                    nameReceive: order[i].nameReceive,
                    phone: order[i].phone,
                    total: order[i].total
                };

                orderJson.push(order_data);
            }
            // console.log(orderJson);
            res.json(orderJson);
        });
    }
    getIdorder(req, res) {
	return __awaiter(this, void 0, void 0, function* () {
	    const idOrder = yield database_1.default.query('SELECT id_order FROM vh_order');
	    res.json(idOrder);
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
            const order = yield database_1.default.query('SELECT a.id_order, a.create_at, DATE_FORMAT(a.exp_date, "%d %M %Y - %T") as exp_date, a.status, '+
            'case when a.courier = "SiCepat Express" then "sicepat" '+
			'when a.courier = "J&T Express" then "jnt" '+
			'when a.courier = "Ninja Xpress" then "ninja" '+
			'when a.courier = "Jalur Nugraha Ekakurir (JNE)" then "jne" '+
            'when a.courier = "Citra Van Titipan Kilat (TIKI)" then "tiki" '+
            'when a.courier = "JNE" then "jne" '+
            'end as courier, concat(a.courier," ", a.courier_service) as namaongkir, a.totalOngkir as ongkir, a.payment_code, a.words, a.sessionid, a.stat_pay, a.payment, (SELECT name FROM vh_payment_type c WHERE a.payment = c.id) as payment_name, a.weight, a.voucherid, format(a.amountvoucher + a.payid,0) as amountv, a.payid, format(a.discount, 0) as harga_disc, ' +
                '(SELECT invoice FROM vh_invoice WHERE id_order = a.id_order LIMIT 1) as invoiceid, ' +
                '(SELECT resi FROM vh_shipping WHERE id_order = a.id_order LIMIT 1) as resiid, ' +
                '(SELECT if(status = 1, "Delivered", "On Process") as status from vh_shipping where id_order = a.id_order LIMIT 1) as statResi, ' +
                '(SELECT format(SUM(quantity * harga) + a.totalOngkir + a.payid, 0) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) as total, ' +
                '(SELECT status FROM vh_confirm_order where transaction_id = a.id_order LIMIT 1) as statusconfirm, ' +
                '(SELECT cod FROM vh_order where id_order = a.id_order LIMIT 1) as statuscod ' +
                'FROM vh_order a ' +
                'LEFT JOIN vh_voucher b ON a.voucherid = b.voucherid ' +
                'WHERE a.id_customer = ? AND a.status = ? ORDER BY a.id DESC', [id, status]);

                return res.json(order);

        });
    }
    getProductCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT x.id_order, x.id_product, x.nic, x.color, x.name, x.image, x.quantity, format(x.harga, 0) as price, format((x.quantity * x.harga), 0) as subtotal, y.sumqty, y.total, format(c.totalOngkir,0) as ongkir, c.weight FROM (SELECT a.id_order, a.id_product, b.name, b.nic, b.color, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x LEFT JOIN (SELECT id_order, sum(quantity)as sumqty, format(SUM(quantity * harga),0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ON x.id_order = y.id_order LEFT JOIN vh_order c ON x.id_order = c.id_order', [id, id]);

                return res.json(product);

        });
    }
    getProductCartTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT a.weight * a.totalOngkir as ongkir FROM vh_order a WHERE a.id_order = ?', [id]);

                return res.json(product);

        });
    }
    orderHeaderA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT x.id_order, x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, x.voucherid, format(x.amountvoucher + x.payid, 0) as amountv, '+
            'format(x.discount, 0) as harga_disc, '+
            'if(c.first_name is null AND c.last_name is null, (SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = x.id_customer LIMIT 1),  CONCAT(c.first_name," ",c.last_name)) as customerName, '+
            'if(c.virtual_account is null OR c.virtual_account = "", x.payment_code, c.virtual_account) as customerVA, '+
            '(c.note) as customerNote, '+
            'y.courier_service, format(y.Ongkir, 0) as totalOngkir, y.courierName, y.kurir, format(z.total + y.Ongkir + x.payid , 0) as totalAmount, '+
            '(select resi from vh_shipping e where x.id_order = e.id_order limit 1) as resi '+
            'FROM vh_order x '+
            'LEFT JOIN '+
            '(SELECT a.id_order, a.courier_service, a.totalOngkir as Ongkir, a.courier as courierName, '+
            'case when a.courier = "SiCepat Express" then "sicepat" '+
            'when a.courier = "J&T Express" then "jnt" '+
            'when a.courier = "Ninja Xpress" then "ninja" '+
            'when a.courier = "Jalur Nugraha Ekakurir (JNE)" then "jne" '+
            'when a.courier = "Citra Van Titipan Kilat (TIKI)" then "tiki" '+
            'when a.courier = "JNE" then "jne" '+
            'end as kurir '+
            'FROM vh_order a '+
            ') y ON x.id_order = y.id_order '+
            'LEFT JOIN '+
            '(SELECT id_order ,SUM(harga * quantity) as total FROM vh_cart GROUP BY id_order) z ON x.id_order =  z.id_order '+
            'LEFT JOIN vh_voucher d ON x.voucherid = d.voucherid '+
            'LEFT JOIN vh_confirm_order c ON x.id_order = c.transaction_id '+
            'WHERE x.id_order = ? ', [id]);

            return res.json(order[0]);

        });
    }
    orderHeaderB(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT CONCAT(a.firstname," ",if (a.lastname is null, "", a.lastname)) as custName, b.nameReceive, a.email, a.create_at, b.phone, b.address, ' +
                'b.id_province, b.id_city, b.id_district, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                'FROM vh_customer a ' +
                'LEFT JOIN vh_customer_info b ' +
                'ON a.id = b.id_customer ' +
                'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);

                return res.json(order[0]);

        });
    }
    orderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield database_1.default.query('SELECT x.id, x.id_order, x.id_product, x.name as prodName, x.image, x.color, x.nic, x.slug_url, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, y.total, format(x.harga * x.quantity, 0) as subTotal ' +
                'FROM ' +
                '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.color, b.nic, b.slug_url, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                'LEFT JOIN ' +
                '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                'ON x.id_order = y.id_order', [id, id]);

                return res.json(order);

        });
	}
	getTotal(req, res) {
		return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const first = new Date(date.getTime() - (24 * 60 * 60 * 1000));
			const date_first = dateFormat(first, "yyyy-mm-dd");
            const date_last = dateFormat(new Date(), "yyyy-mm-dd");
            // console.log(date_first, date_last);
            const total = yield database_1.default.query('SELECT '+
            '(SElECT COUNT(id_order) FROM vh_order WHERE create_at BETWEEN ? AND ?) as totalOrder10, '+
            '(SElECT COUNT(id_order) FROM vh_order WHERE status = 1 AND create_at BETWEEN ? AND ?) as totalSuccess10, '+
            '(SElECT COUNT(id_order) FROM vh_order WHERE status = 6 AND create_at BETWEEN ? AND ?) as totalCancel10, '+
            '(SElECT COUNT(id_order) FROM vh_order WHERE status = 0 AND create_at BETWEEN ? AND ?) as totalWait10, '+
            '(SElECT COUNT(id_order) FROM vh_order limit 1) as totalOrder, '+
            '(SELECT COUNT(id_order) FROM vh_order WHERE status = 1 limit 1) as totalSuccess, '+
            '(SELECT COUNT(id_order) FROM vh_order WHERE status = 6 limit 1) as totalCancel, '+
            '(SELECT COUNT(id_order) FROM vh_order WHERE status = 0 limit 1) as totalWait '+
            'FROM vh_order LIMIT 1', [date_first, date_last, date_first, date_last, date_first, date_last, date_first, date_last]);

			return res.json(total[0]);
		})
    }
    metrictotalorder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const first = new Date(date.getTime() - (9 * 24 * 60 * 60 * 1000));
            const date_first = dateFormat(first, "yyyy-mm-dd");
            const date_last = dateFormat(new Date(), "yyyy-mm-dd");
            const analytic = yield database_1.default.query('SElECT COUNT(id_order) as metrix, DATE_FORMAT(create_at, "%y-%m-%d") as date '+
            'FROM vh_order '+
            'WHERE create_at BETWEEN ? AND NOW() '+
            'GROUP BY DATE_FORMAT(create_at, "%y-%m-%d") '+
            'ORDER BY create_at desc limit 10', [date_first]);
            let metric = [];

            for (let i = date_first; i < date_last; i++) {
                
                request({
                    data: i
                }, function(error, data) {
                    for (let a = 0; a < analytic.length; a++) {

                        let metrix = [];

                        if (analytic[a].date === data.i) {
                            metrix.push(analytic[a].metrix);
                        } else {
                            metrix.push(0);
                        }

                        console.log(metrix);

                        metrix.map(function (mat) {
                            metric.push(mat);
                        })
                    }
                })
            }
            
            console.log(metric);
        });
    }
	getSuccessTotal(req, res) {
		return __awaiter(this, void 0, void 0, function* () {
			const total = yield database_1.default.query('SELECT COUNT(id_order) as totalOrder FROM vh_order WHERE status = 3');

			return res.json(total[0]);
		})
	}
	getFailTotal(req, res) {
		return __awaiter(this, void 0, void 0, function* () {
			const total = yield database_1.default.query('SELECT COUNT(id_order) as totalOrder FROM vh_order WHERE status = 6');

			return res.json(total[0]);
		})
	}
	getWaitingTotal(req, res) {
		return __awaiter(this, void 0, void 0, function* () {
			const total = yield database_1.default.query('SELECT COUNT(id_order) as totalOrder FROM vh_order WHERE status = 0');

			return res.json(total[0]);
		})
	}
	TotalAmount(req, res) {
		return __awaiter(this, void 0, void 0, function* () {
			const total = yield database_1.default.query('select format(sum(amount), 0) as pendapatan '+
			'from '+
			'(SELECT month(create_at) as buln, year(create_at) as tahun, (if(amountvoucher is null OR amountvoucher <> "", amount + totalOngkir + payid, amountvoucher + payid)) as amount FROM `vh_order` WHERE status = 3 )x '+
			'where buln = month(curdate()) AND tahun = year(curdate()) limit 1');

			return res.json(total[0]);
		})
    }
    TotalAmountlastmonth(req, res) {
		return __awaiter(this, void 0, void 0, function* () {
            const month = new Date();
            month.setMonth(month.getMonth() - 1);
			const total = yield database_1.default.query('select format(sum(amount), 0) as pendapatan '+
			'from '+
			'(SELECT month(create_at) as buln, year(create_at) as tahun, IF(amountvoucher is null OR amountvoucher = "", (amount + payid + totalOngkir), (amountvoucher + payid)) as amount FROM `vh_order` WHERE status = 3 )x '+
			'where buln = month(?) AND tahun = year(curdate()) limit 1', [month]);

			return res.json(total[0]);
		})
    }
    createManual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date;
            currentDate.setDate(currentDate.getDate() + 1);
                const order = {
                    id_order: req.body.OI,
                    id_customer: req.body.SD.id_customer,
                    courier: req.body.TO.kurir.name,
                    courier_service: req.body.TO.info.service,
                    weight: req.body.PT.weight,
                    // total: req.body.totalAmount,
                    payment: req.body.PT.payment,
                    status: 0,
					exp_date: currentDate,
					amount: req.body.AM,
                    payid: req.body.PI,
                    totalOngkir: req.body.TO.info.cost[0].value,
                    discount: (req.body.DS > 0) ? req.body.DS : req.body.DO,
                    voucherid: req.body.VRI,
					amountvoucher: req.body.AV
                };
                const date = dateFormat(new Date(), "yyyymmdd");
                const invoice = {
                    invoice: 'INV.' + date + '.' + 'VP' + '.' + req.body.OI,
                    id_order: req.body.OI,
                    create_at: dateFormat(new Date(), "yyyy-mm-dd")
                };

                if (req.body.DN > 0) {
                    const donasi = {
                        id_order: req.body.OI,
                        nama_donasi: '5000 Kebaikan Melawan COVID-19',
                        donasi: req.body.DN,
                        status: 0
                    }
    
                    yield database_1.default.query('INSERT INTO vh_donatur set ?', donasi);
                }
                

                // console.log(order);
                const notif = {
                    id_order: req.body.OI,
                    flag: false
                };
                // console.log(notif);
                for (let i = 0; i < req.body.PD.length; i++) {
                    const cart = {
                        id_order: req.body.OI,
                    };
                    const id = {
                        id: req.body.PD[i].id
                    };
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.OI, req.body.PD[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }
                yield database_1.default.query('INSERT INTO vh_order set ?', order);
                yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                yield database_1.default.query('INSERT INTO vh_invoice set ?', invoice);
                res.json({ message: 'Success' });
                
                function main() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ", if (a.lastname is null, "", a.lastname)) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [req.body.OI]);
                        const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                        const order = yield database_1.default.query('SELECT x.payment, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, x.payid, x.weight as totalWeight, '+
                        'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                        'FROM vh_order x '+
                        'LEFT JOIN '+
                        '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                        'FROM vh_order a) y ON x.id_order = y.id_order '+
                        'LEFT JOIN '+
                        '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                        'WHERE x.id_order = ?', [req.body.OI]);
                        const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [req.body.OI, req.body.OI]);
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
                                defaultLayout: 'order-detail',
                            },
                            viewPath: './views/',
                        };
                        transporter.use('compile', hbs(handlebarOptions));
                        const amount = req.body.PD[0].totalOut + req.body.TO.info.cost[0].value;
                        let potongan;
                        potongan = 0;
                        if (req.body.VR) {
                            potongan = (req.body.DS > 0) ? req.body.DS : req.body.DO;
                        }
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
                            'ridhobagaskara68@gmail.com',
                        ];

                        cclist.toString();
                        
                        // send mail with defined transport object
                        let info = yield transporter.sendMail({
                            from: '"Vapehan Store" <shop@vapehan.com>',
                            to: 'ridhobagaskara68@gmail.com',
                            // cc: cclist,
                            subject: 'Checkout Order Detail',
                            template: 'order-detail',
                            context: {
                                voucher: req.body.VRI,
                                weightkg: weightkg,
                                weightg: weightg,
                                imgUrl: globarUrl,
                                orderId: req.body.OI,
                                cart: carts,
                                company: company[0],
                                order: order[0],
                                customer: customer[0],
                                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                                amountVoucher: order[0].amounv,
                                virtual: '2302112658 | Lee Handoko',
                                payment: 'BCA Transfer'
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
        };
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date;
            currentDate.setDate(currentDate.getDate() + 1);
            /*
            if (req.body.PT.service === 1) {
                const order = {
                    id_order: req.body.OI,
                    id_customer: req.body.SD.id_customer,
                    id_ongkir: req.body.PT.service,
                    weight: req.body.PT.weight,
                    // total: req.body.totalAmount,
                    payment: req.body.PT.payment,
                    status: 0,
                    cod: 0,
                    exp_date: currentDate,
                    payid: req.body.PI,
                    totalOngkir: 0,
                    voucherid: req.body.VRI,
                    amountvoucher: req.body.AV
                };
                // console.log(order);
                for (let i = 0; i < req.body.PD.length; i++) {
                    const cart = {
                        id_order: req.body.OI,
                    };
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.OI, req.body.PD[i].id]);
                    yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }
                const date = dateFormat(new Date(), "yyyyMMdd");
                yield database_1.default.query('INSERT INTO vh_order set ?', order);
                res.json({ message: 'Success' });
            }
            else {
                */
		
                const order = {
                    id_order: req.body.OI,
                    id_customer: req.body.SD.id_customer,
                    courier: req.body.TO.kurir.name,
                    courier_service: req.body.TO.info.service,
                    weight: req.body.PT.weight,
                    // total: req.body.totalAmount,
                    payment: req.body.PT.payment,
                    status: 0,
					exp_date: currentDate,
					amount: req.body.AMD,
                    payid: req.body.PI,
                    totalOngkir: req.body.TO.info.cost[0].value,
                    voucherid: req.body.VRI,
                    amountvoucher: req.body.AV,
                    discount: (req.body.DS > 0) ? req.body.DS : req.body.DO,
                };
                // console.log(order);
                const notif = {
                    id_order: req.body.OI,
                    flag: false
                };
                // console.log(order);

                if (req.body.DN > 0) {
                    const donasi = {
                        id_order: req.body.OI,
                        nama_donasi: '5000 Kebaikan Melawan COVID-19',
                        donasi: req.body.DN,
                        status: 0
                    }
    
                    yield database_1.default.query('INSERT INTO vh_donatur set ?', donasi);
                }
                
                const id_order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order =  ? LIMIT 1', [req.body.OI]);
                // console.log(id_order);
                if (id_order.length > 0) {
                    // console.log('1');
                    yield database_1.default.query('UPDATE vh_order SET status = 0 WHERE id_order = ?', [req.body.OI]);
                } else {
                    // console.log('2');
                    yield database_1.default.query('INSERT INTO vh_order set ?', order);
                    yield database_1.default.query('INSERT INTO vh_notiforder set ?', notif);
                }

                for (let i = 0; i < req.body.PD.length; i++) {
                    const cart = {
                        id_order: req.body.orderId,
                    };
                    const id = {
                        id: req.body.PD[i].id
                    };
                    // console.log(id);
                    // console.log(cart);
                    yield database_1.default.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.OI, req.body.PD[i].id]);
                    // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
                }
                
                res.json(req.body);
            // }
            // Send Email
            /*
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [req.body.OI]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, '+
                    'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher, 0) as amounv '+
                    'FROM vh_order x '+
                    'LEFT JOIN '+
                    '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                    'FROM vh_order a) y ON x.id_order = y.id_order '+
                    'LEFT JOIN '+
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                    'WHERE x.id_order = ?', [req.body.OI]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [req.body.OI, req.body.OI]);
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
                            defaultLayout: 'order-detail',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    const amount = req.body.PD[0].totalOut + req.body.TO.info.cost[0].value;
                    let potongan;
                    potongan = 0;
                    if (req.body.VR) {
                        if (req.body.VR.vouchertab === 'Amount') {
                            potongan = req.body.VR.vouchervalue;
                        }
                        else {
                            potongan = +req.body.AMPT;
                        }
                    }
		    let weightkg = false;
		    let weightg = false;
		    if (order[0].totalWeight >= 1000) {
		    	weightkg = true;
		    } else {
			weightg = true;
		    }
			
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: req.body.SD.email,
                        subject: 'Checkout Order Detail',
                        template: 'order-detail',
                        context: {
                            imgUrl: globarUrl,
                            orderId: req.body.OI,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                            amountVoucher: order[0].amounv,
			    voucher: req.body.VRI,
                            virtual: '3124678649',
			    weightkg: weightkg,
			    weightg: weightg
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
            */
        });
    }
    createTempo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body)
            const currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 5);
            const create = dateFormat(new Date(), "HH:MM:ss");

            // console.log(order);

            const check = yield database_1.default.query('SELECT *, if(amountvoucher is null OR amountvoucher = "", amount + totalOngkir, amountvoucher) as total FROM vh_order_tempo WHERE id_customer = ? AND status = 0 ORDER BY id desc LIMIT 1', [req.body.SD.accessToken]);

            // console.log(check);

            const order = {
                id_order: req.body.OI,
                id_customer: req.body.SD.accessToken,
                courier: req.body.TO.kurir.name,
                courier_service: req.body.TO.info.service,
                weight: req.body.PT.weight,
                // total: req.body.totalAmount,
                status: 0,
                exp_date: currentDate,
                create_at: create,
                amount: req.body.AMD,
                payid: req.body.PI,
                totalOngkir: req.body.TO.info.cost[0].value,
                voucherid: req.body.VRI,
                amountvoucher: req.body.AV,
                userAgent: req.body.DV.userAgent,
                os: req.body.DV.os,
                ip: req.body.IP
            };

            let total;
            if (req.body.AV) {
                total = req.body.AV;
            } else {
                total = order.amount + order.totalOngkir;
            }

            if (check.length > 0 && check[0].total === total ) {
                // console.log('1');
                const order1 = {
                    id_order: req.body.OI,
                    id_customer: req.body.SD.accessToken,
                    courier: req.body.TO.kurir.name,
                    courier_service: req.body.TO.info.service,
                    weight: req.body.PT.weight,
                    // total: req.body.totalAmount,
                    status: 0,
                    exp_date: currentDate,
                    create_at: create,
                    amount: req.body.AMD,
                    payid: req.body.PI,
                    totalOngkir: req.body.TO.info.cost[0].value,
                    voucherid: req.body.VRI,
                    amountvoucher: req.body.AV,
                    userAgent: req.body.DV.userAgent,
                    os: req.body.DV.os,
                    ip: req.body.IP
                };
                yield database_1.default.query('UPDATE vh_order_tempo SET ? WHERE id_customer = ? AND status = 0', [order1, req.body.SD.accessToken]);
            } else if (check.length > 0 && check && check[0].total !== total ) {
                // console.log('2');
                const order1 = {
                    id_order: req.body.OI,
                    id_customer: req.body.SD.accessToken,
                    courier: req.body.TO.kurir.name,
                    courier_service: req.body.TO.info.service,
                    weight: req.body.PT.weight,
                    // total: req.body.totalAmount,
                    status: 0,
                    exp_date: currentDate,
                    create_at: create,
                    amount: req.body.AMD,
                    payid: req.body.PI,
                    totalOngkir: req.body.TO.info.cost[0].value,
                    voucherid: req.body.VRI,
                    amountvoucher: req.body.AV,
                    userAgent: req.body.DV.userAgent,
                    os: req.body.DV.os,
                    ip: req.body.IP
                };
                yield database_1.default.query('UPDATE vh_order_tempo SET ? WHERE id_customer = ? AND status = 0', [order1, req.body.SD.accessToken]);
            } else {
                const order2 = {
                    id_order: req.body.OI,
                    id_customer: req.body.SD.accessToken,
                    courier: req.body.TO.kurir.name,
                    courier_service: req.body.TO.info.service,
                    weight: req.body.PT.weight,
                    // total: req.body.totalAmount,
                    status: 0,
                    exp_date: currentDate,
                    create_at: create,
                    amount: req.body.AMD,
                    payid: req.body.PI,
                    totalOngkir: req.body.TO.info.cost[0].value,
                    voucherid: req.body.VRI,
                    amountvoucher: req.body.AV,
                    userAgent: req.body.DV.userAgent,
                    os: req.body.DV.os,
                    ip: req.body.IP
                };
                yield database_1.default.query('INSERT INTO vh_order_tempo SET ?', [order2]);
                // console.log('3');
            }

            for (let i = 0; i < req.body.PD.length; i++) {
                const cart = {
                    id_order: req.body.OI,
                };
                const id = {
                    id: req.body.PD[i].id
                };
                // console.log(id);
                // console.log(cart);
                yield database_1.default.query('UPDATE vh_cart SET tempo = 0 WHERE id = ?', [req.body.PD[i].id]);
                // yield database_1.default.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?', [req.body.PD[i].qty, req.body.PD[i].id_product]);
            }
            
            res.json({ text: 'Ok' });
        });
    }
    checkout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body)
            const post = req.body;

            const check = yield database_1.default.query('SELECT id, id_order, '+
            '(SELECT id FROM vh_customer WHERE a.id_customer = accessToken) as id_customer, '+
            'if(amountvoucher is null OR amountvoucher = "", amount, amountvoucher) as amount, '+
            'totalOngkir, payid, '+
            '(if(amountvoucher is null OR amountvoucher = "", amount + totalOngkir, amountvoucher)) as total '+
            'FROM vh_order_tempo a '+
            'WHERE id_customer = ? AND status = 0 AND userAgent = ? AND os = ? LIMIT 1', [post.access, post.device.userAgent, post.device.os]);

            if (check.length > 0 ) {
                res.json(check[0])
            } else {
                res.json(null);
            }
        });
    }
    resendemailOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                    'FROM vh_customer a ' +
                    'LEFT JOIN vh_customer_info b ' +
                    'ON a.id = b.id_customer ' +
                    'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                    'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT (SELECT name FROM vh_payment_type where id = x.payment LIMIT 1) as payment, if(x.payment = "01", "2302112658 | Lee Handoko", x.payment_code) as payment_code, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, x.payid, x.weight as totalWeight, x.voucherid, x.discount, '+
                    'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, (z.totalHarga + y.ongkir + x.payid) as Amount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                    'FROM vh_order x '+
                    'LEFT JOIN '+
                    '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                    'FROM vh_order a) y ON x.id_order = y.id_order '+
                    'LEFT JOIN '+
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                    'WHERE x.id_order = ?', [id]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [id, id]);
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
                            defaultLayout: 'order-detail',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    const amount = +order[0].Amount - +order[0].payid;
                    let potongan = 0;

                    if (order[0].voucherid) {
                        potongan = order[0].discount;
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
                  }

                    var cclist = [
                        'vapehan@gmail.com',
                        'shop@vapehan.com',
                        'ridhobagaskara68@gmail.com',
                    ];

                    cclist.toString();
                    //  console.log(potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), voucher[0].vouchervalue)
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: 'ridhobagaskara68@gmail.com',
                        // cc: cclist,
                        subject: 'Checkout Order Detail',
                        template: 'order-detail',
                        context: {
                            imgUrl: globarUrl,
                            orderId: id,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            voucher: order[0].voucherid,
                            discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                            amountVoucher: order[0].amounv,
                            virtual: order[0].payment_code,
                            payment: order[0].payment,
			                weightkg: weightkg,
                             weightg: weightg,
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
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                    'FROM vh_customer a ' +
                    'LEFT JOIN vh_customer_info b ' +
                    'ON a.id = b.id_customer ' +
                    'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                    'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT (SELECT name FROM vh_payment_type where id = x.payment LIMIT 1) as payment, x.payment_code, x.status, DATE_FORMAT(x.create_at, "%d-%M-%Y") as create_at, x.payid, x.weight as totalWeight, x.voucherid, x.discount, '+
                    'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, (z.totalHarga + y.ongkir + x.payid) as Amount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                    'FROM vh_order x '+
                    'LEFT JOIN '+
                    '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                    'FROM vh_order a) y ON x.id_order = y.id_order '+
                    'LEFT JOIN '+
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                    'WHERE x.id_order = ?', [id]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [id, id]);
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
                            defaultLayout: 'invoice-order',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    const amount = +order[0].Amount - +order[0].payid;
                    let potongan = 0;

                    if (order[0].voucherid) {
                        potongan = order[0].discount;
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
                      }

                        var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                            'ridhobagaskara68@gmail.com',
                        ];

                        cclist.toString();

                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: 'ridhobagaskara68@gmail.com',
                        // cc: cclist,
                        subject: 'Invoice Order',
                        template: 'invoice-order',
                        context: {
                            imgUrl: globarUrl,
                            invoice: req.body.orders.invoiceid,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            voucher: order[0].voucherid,
                            discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                            amountVoucher: order[0].amounv,
                            date: order[0].create_at,
			                weightkg: weightkg,
                            weightg: weightg,
                            payment: order[0].payment
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
    verifyPay(req, res) {
	return __awaiter(this, void 0, void 0, function* () {
        const post = JSON.parse(req.body.data);
	     const data = {
		    payment: post.PAYMENTCHANNEL,
		    idOrder: post.TRANSIDMERCHANT
         }
         // console.log(data);
	     yield database_1.default.query('UPDATE vh_order SET payment = ? WHERE id_order = ?', [data.payment, data.idOrder]);
	     res.json({ text: 'Success' });	     
	});
    }
    notifPay(req, res) {
	return __awaiter(this, void 0, void 0, function* () {
        const post = JSON.parse(req.body.data);
        // console.log(post.RESPONSECODE, post);
	    if (post.RESPONSECODE === '0000') {
		const data = {
           idOrder: post.TRANSIDMERCHANT,
           payment_code: post.PAYMENTCODE,
           words: post.WORDS,
           sessionid: post.SESSIONID
        }
        const currentDate = dateFormat(new Date(), "yyyymmdd");
        const invoice = {
            invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + req.body.OI,
            id_order: req.body.OI,
            create_at: currentDate
        };
        
        // console.log('berhasilnot');
        yield database_1.default.query('UPDATE vh_order SET payment_code = ?, words = ?, sessionid = ?, status = 5 WHERE id_order = ?', [data.payment_code, data.words, data.sessionid, data.idOrder]);
        yield database_1.default.query('INSERT INTO vh_invoice set ?', invoice);
        res.json({ text: 'Payment Success' });
         // Send Email
         function main() {
            return __awaiter(this, void 0, void 0, function* () {
                const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                'FROM vh_customer a ' +
                'LEFT JOIN vh_customer_info b ' +
                'ON a.id = b.id_customer ' +
                'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.TRANSIDMERCHANT]);
                const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                const order = yield database_1.default.query('SELECT x.payment, x.payment_code, x.status, x.create_at, x.payid, x.weight as totalWeight, x.voucherid, x.discount, '+
                'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, (z.totalHarga + y.ongkir + x.payid) as Amount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                'FROM vh_order x '+
                'LEFT JOIN '+
                '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                'FROM vh_order a) y ON x.id_order = y.id_order '+
                'LEFT JOIN '+
                '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                'WHERE x.id_order = ?', [post.TRANSIDMERCHANT]);
                const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                    'FROM ' +
                    '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                    'LEFT JOIN ' +
                    '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                    'ON x.id_order = y.id_order', [post.TRANSIDMERCHANT, post.TRANSIDMERCHANT]);
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
                    potongan = order[0].discount;
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
                  }
                // console.log(voucher[0].vouchertab);
                // send mail with defined transport object

                var cclist = [
                    'vapehan@gmail.com',
                    'shop@vapehan.com',
                    'ridhobagaskara68@gmail.com',
                ];

                cclist.toString();

                let info = yield transporter.sendMail({
                    from: '"Vapehan Store" <shop@vapehan.com>',
                    to: 'ridhobagaskara68@gmail.com',
                    // cc: cclist,
                    subject: 'Payment Accepted',
                    template: 'payment-accept',
                    context: {
                        imgUrl: 'http://192.168.1.160:4000/',
                        orderId: post.TRANSIDMERCHANT,
                        cart: carts,
                        company: company[0],
                        order: order[0],
                        voucher: order[0].voucherid,
                        discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                        amountVoucher: order[0].amounv,
                        customer: customer[0],
                        virtual: order[0].payment_code,
                        payment: paymentcode,
                        date: dateFormat(new Date(), "dd-mmmm-yyyy h:MM:ss TT"),
                        weightkg: weightkg,
                        weightg: weightg
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
        } else if( post.RESPONSECODE === '' || post.RESPONSECODE === undefined || post.RESPONSECODE === '5510' || post.RESPONSECODE === '5536') {
            const data = {
                idOrder: post.TRANSIDMERCHANT,
                stat_pay: post.RESPONSECODE,
                words: post.WORDS,
                sessionid: post.SESSIONID
            }
            // console.log('gx jadi');
            yield database_1.default.query('DELETE FROM vh_order WHERE id_order = ?', [data.idOrder]);
            yield database_1.default.query('UPDATE vh_cart set id_order = null WHERE id_order = ?', [data.idOrder]);
            res.json({ text: 'Payment fail' });
        } else if (post.RESPONSECODE === '5507' || post.RESPONSECODE === '5509' || post.RESPONSECODE === '5514' || post.RESPONSECODE === '5519' ) {
		const data = {
            idOrder: post.TRANSIDMERCHANT,
            words: post.WORDS,
            sessionid: post.SESSIONID
        }
        // console.log('gagalnot');
		yield database_1.default.query('UPDATE vh_order SET words = ?, sessionid = ?, status = 6 WHERE id_order = ?', [data.words, data.sessionid,data.idOrder]);
		res.json({ text: 'Payment Fail' });
	    } else {
		const data = {
		    stat: post.RESPONSECODE, 
            idOrder: post.TRANSIDMERCHANT,
            payment_code: post.PAYMENTCODE,
            words: post.WORDS,
            sessionid: post.SESSIONID
        }
        // console.log('hmmnot');
        const currentDate = dateFormat(new Date(), "yyyymmdd");
        const invoice = {
            invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + req.body.OI,
            id_order: req.body.OI,
            create_at: currentDate
        };
        
        yield database_1.default.query('UPDATE vh_order SET payment_code = ?, words = ?, sessionid = ?, stat_pay = ? WHERE id_order = ?', [data.payment_code, data.words, data.sessionid, data.stat, data.idOrder]);
        yield database_1.default.query('INSERT INTO vh_invoice set ?', invoice);
		res.json({ text: 'Payment Unknow' });
	    }
	});
    }
    redirectGate(req, res) {
	return __awaiter(this, void 0, void 0, function* () {
        const post = JSON.parse(req.body.data);
        // console.log(post.STATUSCODE);
	    if (post.STATUSCODE === '0000') {
		const data = {
           idOrder: post.TRANSIDMERCHANT,
           payment: post.PAYMENTCHANNEL,
           payment_code: post.PAYMENTCODE,
           words: post.WORDS,
           sessionid: post.SESSIONID
        }
        // console.log('berhasilred');
        const currentDate = dateFormat(new Date(), "yyyymmdd");
        const invoice = {
            invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + req.body.OI,
            id_order: req.body.OI,
            create_at: currentDate
        };
        
        yield database_1.default.query('UPDATE vh_order SET payment = ?, payment_code = ?, words = ?, sessionid = ?, status = 5, stat_pay = ? WHERE id_order = ?', [data.payment, data.payment_code, data.words, data.sessionid, post.STATUSCODE, data.idOrder]);
        yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);
        res.json({ text: 'Payment success' });
        /// send email
        function main() {
            return __awaiter(this, void 0, void 0, function* () {
                const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                    'FROM vh_customer a ' +
                    'LEFT JOIN vh_customer_info b ' +
                    'ON a.id = b.id_customer ' +
                    'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                    'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.TRANSIDMERCHANT]);
                const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                const order = yield database_1.default.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, x.discount, '+
                'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv '+
                'FROM vh_order x '+
                'LEFT JOIN '+
                '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                'FROM vh_order a) y ON x.id_order = y.id_order '+
                'LEFT JOIN '+
                '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                'WHERE x.id_order = ?', [post.TRANSIDMERCHANT]);
                const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                    'FROM ' +
                    '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                    'LEFT JOIN ' +
                    '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                    'ON x.id_order = y.id_order', [post.TRANSIDMERCHANT, post.TRANSIDMERCHANT]);
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
                // const amount = req.body.PD[0].totalOut + req.body.TO.info.cost[0].value;
                let potongan = 0;

                    if (order[0].voucherid) {
                        potongan = order[0].discount;
                    }
		        let weightkg = false;
                    let weightg = false;
                    if (order[0].totalWeight >= 1000) {
                        weightkg = true;
                    } else {
                        weightg = true;
                    }

                let paymentcode = '';
                switch(post.PAYMENTCHANNEL) {
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
                  }

                    var cclist = [
                        'vapehan@gmail.com',
                        'shop@vapehan.com',
                        'ridhobagaskara68@gmail.com',
                    ];

                    cclist.toString();
        
                // send mail with defined transport object
                let info = yield transporter.sendMail({
                    from: '"Vapehan Store" <shop@vapehan.com>',
                    to: 'ridhobagaskara68@gmail.com',
                    // cc: cclist,
                    subject: 'Payment Accepted',
                    template: 'payment-accept',
                    context: {
                        imgUrl: globarUrl,
                        orderId: post.TRANSIDMERCHANT,
                        cart: carts,
                        company: company[0],
                        order: order[0],
                        voucher: order[0].voucherid,
                        customer: customer[0],
                        discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                        amountVoucher: order[0].amounv,
                        virtual: post.PAYMENTCODE,
                        date: dateFormat(new Date(), "dd-mmmm-yyyy h:MM:ss TT"),
                        payment: paymentcode,
                        weightkg: weightkg,
                        weightg: weightg
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
        } else if( post.STATUSCODE === '' || post.STATUSCODE === undefined || post.STATUSCODE === '5510' || post.STATUSCODE === '5536') {
            const data = {
                idOrder: post.TRANSIDMERCHANT,
                payment: post.PAYMENTCHANNEL,
                stat_pay: post.STATUSCODE,
                words: post.WORDS,
                sessionid: post.SESSIONID
            }
            // console.log('gx jadi');
            yield database_1.default.query('DELETE FROM vh_order WHERE id_order = ?', [data.idOrder]);
            yield database_1.default.query('UPDATE vh_cart set id_order = null WHERE id_order = ?', [data.idOrder]);
            res.json({ text: 'Payment fail' });
        } else if (post.STATUSCODE === '5507' || post.STATUSCODE === '5509' || post.STATUSCODE === '5514' || post.STATUSCODE === '5519') {
            const data = {
                idOrder: post.TRANSIDMERCHANT,
                payment: post.PAYMENTCHANNEL,
                stat_pay: post.STATUSCODE,
                words: post.WORDS,
                sessionid: post.SESSIONID
            }
            // console.log('gagalred');
            yield database_1.default.query('UPDATE vh_order SET payment = ?, words = ?, sessionid = ?, status = 6, stat_pay = ? WHERE id_order = ?', [data.payment, data.words, data.sessionid, data.stat_pay, data.idOrder]);
            res.json({ text: 'Payment fail' });
        } else {
            const data = {
                stat: post.STATUSCODE,
                idOrder: post.TRANSIDMERCHANT,
                payment: post.PAYMENTCHANNEL,
                payment_code: post.PAYMENTCODE,
                words: post.WORDS,
                sessionid: post.SESSIONID
            }
            // console.log('hmmred');
            const currentDate = dateFormat(new Date(), "yyyymmdd");
            const invoice = {
                invoice: 'INV.' + currentDate + '.' + 'VP' + '.' + req.body.OI,
                id_order: req.body.OI,
                create_at: currentDate
            };
            
            yield database_1.default.query('UPDATE vh_order SET status = 0, payment = ?, payment_code = ?, words = ?, sessionid = ?, stat_pay = ? WHERE id_order = ?', [data.payment, data.payment_code, data.words, data.sessionid, data.stat, data.idOrder]);
            yield database_1.default.query('INSERT INTO vh_invoice set ?', [invoice]);
            res.json({ text: 'Payment Unknow' });
            // send email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                        'FROM vh_customer a ' +
                        'LEFT JOIN vh_customer_info b ' +
                        'ON a.id = b.id_customer ' +
                        'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                        'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [post.TRANSIDMERCHANT]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.status, DATE_FORMAT(x.create_at, "%d %M %Y %H %i %p") as create_at, x.payid, x.weight as totalWeight, '+
                    'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv, x.discount '+
                    'FROM vh_order x '+
                    'LEFT JOIN '+
                    '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                    'FROM vh_order a) y ON x.id_order = y.id_order '+
                    'LEFT JOIN '+
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                    'WHERE x.id_order = ?', [post.TRANSIDMERCHANT]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [post.TRANSIDMERCHANT, post.TRANSIDMERCHANT]);
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
                            defaultLayout: 'order-detail',
                        },
                        viewPath: './views/',
                    };
                    transporter.use('compile', hbs(handlebarOptions));
                    // const amount = req.body.PD[0].totalOut + req.body.TO.info.cost[0].value;
                    let potongan = 0;
    
                        if (order[0].voucherid) {
                            potongan = order[0].discount;
                        }
                    let weightkg = false;
                        let weightg = false;
                        if (order[0].totalWeight >= 1000) {
                            weightkg = true;
                        } else {
                            weightg = true;
                        }
    
                    let paymentcode = '';
                    switch(post.PAYMENTCHANNEL) {
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
                      }

                      var cclist = [
                            'vapehan@gmail.com',
                            'shop@vapehan.com',
                            'ridhobagaskara68@gmail.com',
                        ];

                        cclist.toString();
            
                    // send mail with defined transport object
                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: 'ridhobagaskara68@gmail.com',
                        // cc: cclist,
                        subject: 'Checkout Order Detail',
                        template: 'order-detail',
                        context: {
                            imgUrl: globarUrl,
                            orderId: post.TRANSIDMERCHANT,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            customer: customer[0],
                            discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                            amountVoucher: order[0].amounv,
                            voucher: req.body.VRI,
                            virtual: post.PAYMENTCODE,
                            payment: paymentcode,
                            weightkg: weightkg,
                            weightg: weightg
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
	});
    }
    report(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            // console.log(post);
            if (post.month === null && post.date === null || post.month === 'null' && post.date === 'null') {

                const monthNow = new Date().getMonth() + 1;

                const report = yield database_1.default.query('SELECT x.create_at, x.status_name, format(sum(amount), 0) as amount, count(x.status) as Count_Total '+
                'FROM '+
                '(SELECT status, flag, IF(amountvoucher is null OR amountvoucher = "", (amount + payid + totalOngkir), (amountvoucher + payid)) as amount, DATE_FORMAT(a.create_at,"%d-%m-%Y") as create_at, '+
                'case when status = 0 then "Waiting Payment" '+
                'when status = 1 then "On Process" '+
                'when status = 2 then "Sending" '+
                'when status = 3 then "Order Received on Customer" '+
                'when status = 4 then "Verification Payment" '+
                'when status = 5 then "Accepted Payment" '+
                'when status = 6 then "Cancel Payment" '+
                'end as status_name '+
                'FROM vh_order a '+
                'WHERE MONTH(a.create_at) = ? ) x '+
                'GROUP BY x.status '+
                'ORDER BY x.flag asc', [monthNow]);

                let reportJson = [];
                // console.log(report, monthNow);

                for (let i = 0; i < report.length; i++) {
                    const report_data = {
                        id: [i],
                        date: report[i].create_at,
                        status: report[i].status_name,
                        total: report[i].amount,
                        count: report[i].Count_Total
                    };

                    reportJson.push(report_data);
                }
                // console.log(orderJson);
                res.json(reportJson);
            } else {
                // console.log('test');
                if (!post.month || post.month === null || post.month === 'null') {
                    const reportDate = yield database_1.default.query('SELECT x.create_at, x.status_name, format(sum(amount), 0) as amount, count(x.status) as Count_Total '+
                    'FROM '+
                    '(SELECT status, flag, IF(amountvoucher is null OR amountvoucher = "", (amount + payid + totalOngkir), (amountvoucher + payid)) as amount, DATE_FORMAT(a.create_at,"%d-%m-%Y") as create_at, '+
                    'case when status = 0 then "Waiting Payment" '+
                    'when status = 1 then "On Process" '+
                    'when status = 2 then "Sending" '+
                    'when status = 3 then "Order Received on Customer" '+
                    'when status = 4 then "Verification Payment" '+
                    'when status = 5 then "Accepted Payment" '+
                    'when status = 6 then "Cancel Payment" '+
                    'end as status_name '+
                    'FROM vh_order a '+
                    'WHERE DATE_FORMAT(a.create_at,"%d-%m-%Y") = ? ) x '+
                    'GROUP BY x.status '+
                    'ORDER BY x.flag asc', [post.date]);

                    let reportDateJson = [];
                // console.log(order);

                    for (let i = 0; i < reportDate.length; i++) {
                        const reportDate_data = {
                            id: [i],
                            date: reportDate[i].create_at,
                            status: reportDate[i].status_name,
                            total: reportDate[i].amount,
                            count: reportDate[i].Count_Total
                        };

                        reportDateJson.push(reportDate_data);
                    }
                    // console.log(orderJson);
                    res.json(reportDateJson);
                } else {
                    const reportMonth = yield database_1.default.query('SELECT x.create_at, x.status_name, format(sum(amount), 0) as amount, count(x.status) as Count_Total '+
                    'FROM '+
                    '(SELECT status, flag, IF(amountvoucher is null OR amountvoucher = "", (amount + payid + totalOngkir), (amountvoucher + payid)) as amount, DATE_FORMAT(a.create_at,"%d-%m-%Y") as create_at, '+
                    'case when status = 0 then "Waiting Payment" '+
                    'when status = 1 then "On Process" '+
                    'when status = 2 then "Sending" '+
                    'when status = 3 then "Order Received on Customer" '+
                    'when status = 4 then "Verification Payment" '+
                    'when status = 5 then "Accepted Payment" '+
                    'when status = 6 then "Cancel Payment" '+
                    'end as status_name '+
                    'FROM vh_order a '+
                    'WHERE MONTH(a.create_at) = ? ) x '+
                    'GROUP BY x.status '+
                    'ORDER BY x.flag asc', [post.month]);

                    let reportMonthJson = [];
                // console.log(order);

                    for (let i = 0; i < reportMonth.length; i++) {
                        const reportMonth_data = {
                            id: [i],
                            date: reportMonth[i].create_at,
                            status: reportMonth[i].status_name,
                            total: reportMonth[i].amount,
                            count: reportMonth[i].Count_Total
                        };

                        reportMonthJson.push(reportMonth_data);
                    }
                    // console.log(orderJson);
                    res.json(reportMonthJson);
                }
            }
        });
    }
    updateResi(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const shipping = {
                id_order : post.id_order,
                status: post.status,
                delivery_date: post.delivery_at.pod_date
            }
            yield database_1.default.query('UPDATE vh_shipping SET status = ?, delivery_date = ? WHERE id_order = ? and status = 0', [shipping.status, shipping.delivery_date, shipping.id_order]);
            res.json({ text: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let cancel = req.body.reason;
            if (req.body.reason == undefined || req.body.reason == null || req.body.reason == "" ) {
                cancel = 'cancel by admin';
            }
            const data = {
                reason: cancel
            }
            const order = yield database_1.default.query('SELECT id_order FROM vh_order WHERE id_order = ? LIMIT 1', [id]);
            yield database_1.default.query('UPDATE vh_order SET status = 6, reason = ? WHERE id_order = ?', [data.reason, id]);
            if (order == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ text: 'Success Cancel' });
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
            const data = {
                status: req.body.st,
            };
            const order = yield database_1.default.query('SELECT id FROM vh_order WHERE id_order = ?', [id]);
            if (req.body.st == 6) {
                yield database_1.default.query('UPDATE vh_order set ?, reason = CONCAT("Cancel by", " ", ?) WHERE id_order = ?', [data, req.body.ad, id]);
            } else {
                yield database_1.default.query('UPDATE vh_order set ? WHERE id_order = ?', [data, id]);
            }
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
            let adminName= '';

            if (!req.body.ad || req.body.ad === undefined || req.body.ad === null) {
                adminName = 'System'
            } else {
                adminName = req.body.ad
            }
            const data = {
                status: req.body.st,
                approve_by: adminName
            };
            const order = yield database_1.default.query('SELECT id FROM vh_order WHERE id_order = ?', [id]);
            yield database_1.default.query('UPDATE vh_order set status = ?, payDate = if(payDate is null, NOW(), payDate), approve_by = ?, flag = 1 WHERE id_order = ?', [data.status, data.approve_by.toString(), id]);
            // yield database_1.default.query('UPDATE vh_confirm_order SET status = 1 WHERE transaction_id = ?', [id]);
            if (order == "") {
                res.status(404).json({ text: "Order doesn't exists" });
            }
            else {
                res.json({ message: 'The Order was Update' });
            }
            
            // Send Email
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const customer = yield database_1.default.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, b.postal, c.province, c.city, c.type, c.subdistrict_name ' +
                    'FROM vh_customer a ' +
                    'LEFT JOIN vh_customer_info b ' +
                    'ON a.id = b.id_customer ' +
                    'LEFT JOIN vh_subdistrict c ON b.id_district = c.subdistrict_id ' +
                    'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
                    const company = yield database_1.default.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
                    const order = yield database_1.default.query('SELECT x.payment, x.payment_code, x.status, x.create_at, x.payid, x.weight as totalWeight, x.voucherid, '+
                    'y.courier_service, y.totalOngkir, y.courier, z.totalAmount, (z.totalHarga + y.ongkir + x.payid) as Amount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher + x.payid, 0) as amounv, x.discount '+
                    'FROM vh_order x '+
                    'LEFT JOIN '+
                    '(SELECT a.id_order, a.courier_service, format(a.totalOngkir, 0) as totalOngkir, a.totalOngkir as ongkir, a.courier '+
                    'FROM vh_order a) y ON x.id_order = y.id_order '+
                    'LEFT JOIN '+
                    '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order = z.id_order '+
                    'WHERE x.id_order = ?', [id]);
                    const carts = yield database_1.default.query('SELECT x.name as prodName, x.image, x.quantity, ' + 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal ' +
                        'FROM ' +
                        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN ' + 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x ' +
                        'LEFT JOIN ' +
                        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ' +
                        'ON x.id_order = y.id_order', [id, id]);
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
                        potongan = order[0].discount;
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
                        'ridhobagaskara68@gmail.com',
                    ];

                    cclist.toString();

                    let info = yield transporter.sendMail({
                        from: '"Vapehan Store" <shop@vapehan.com>',
                        to: 'ridhobagaskara68@gmail.com',
                        // cc: cclist,
                        subject: 'Payment Accepted',
                        template: 'payment-accept',
                        context: {
                            imgUrl: 'http://192.168.1.160:4000/',
                            orderId: id,
                            cart: carts,
                            company: company[0],
                            order: order[0],
                            voucher: order[0].voucherid,
                            discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                            amountVoucher: order[0].amounv,
                            customer: customer[0],
                            virtual: order[0].payment_code,
                            payment: paymentcode,
                            date: dateFormat(new Date(), "dd-mmmm-yyyy"),
			                weightkg: weightkg,
			                weightg: weightg
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
