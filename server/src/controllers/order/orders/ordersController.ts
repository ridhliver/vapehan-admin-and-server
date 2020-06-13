import {Request, Response } from 'express';
import { Router } from 'express';
import pool from '../../../database';
var dateFormat = require('dateformat');

var globarUrl = '192.168.1.160:4000';

var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


class OrderController {

    public router: Router = Router();

    public async list(req: Request, res: Response) {
        const order = await pool.query('SELECT a.id, a.id_order, a.payment, a.status, a.create_at, a.voucherid, format(a.amountvoucher, 0) as amountv, '+
        'case when b.vouchertab = "Amount" then format(b.vouchervalue, 0) '+
        'when b.vouchertab = "Percent" then format((SELECT SUM(quantity * harga) + (SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) * (b.vouchervalue * 0.01), 0) '+
        'end as harga_disc, '+
        '(SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = a.id_customer LIMIT 1) as customerName, '+
        '(SELECT format(SUM(quantity * harga) + (SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) + a.payid, 0) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) as total '+
        'FROM vh_order a '+
        'LEFT JOIN vh_voucher b ON a.voucherid = b.voucherid ');
        res.json(order);
    }

    public async parameterStatus(req: Request, res: Response) {
        const { id } = req.params;
        const order = await pool.query('');
        res.json(order);
    }

    public async Imagelist(req: Request, res: Response) {
        const { id } = req.params;
        const order = await pool.query('SELECT * FROM vh_order_image WHERE id_order = ?', [id]);
        res.json(order);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const status = req.body.meter;
        const order = await pool.query('SELECT a.id_order, a.create_at, a.exp_date, a.status, a.payment, a.weight, a.voucherid, format(a.amountvoucher,0) as amountv, a.payid, '+
        'case when b.vouchertab = "Amount" then format(b.vouchervalue, 0) '+
        'when b.vouchertab = "Percent" then format((SELECT SUM(quantity * harga) + (SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) * (b.vouchervalue * 0.01), 0) '+
        'end as harga_disc, '+
        '(SELECT name FROM vh_courier WHERE id in (SELECT id_courier FROM vh_ongkir WHERE id = a.id_ongkir) LIMIT 1) as namaongkir, '+
        '(SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) as ongkir, '+
        '(SELECT invoice FROM vh_invoice WHERE id_order = a.id_order LIMIT 1) as invoiceid, '+
        '(SELECT resi FROM vh_shipping WHERE id_order = a.id_order LIMIT 1) as resiid, '+ 
        '(SELECT format(SUM(quantity * harga) + (SELECT ongkir * a.weight FROM vh_ongkir WHERE id = a.id_ongkir) + a.payid, 0) FROM vh_cart WHERE id_order = a.id_order GROUP BY id_order) as total, '+
        '(SELECT status FROM vh_confirm_order where transaction_id = a.id_order LIMIT 1) as statusconfirm, '+
        '(SELECT cod FROM vh_order where id_order = a.id_order LIMIT 1) as statuscod '+
        'FROM vh_order a '+
        'LEFT JOIN vh_voucher b ON a.voucherid = b.voucherid '+
        'WHERE a.id_customer = ? AND a.status = ? ORDER BY a.id DESC', [id, status]);
        if (order.length > 0) {
            return res.json(order);
        }
        res.status(404).json({text: "Order doesn't exists "});
    }

    public async getProductCart(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT x.id_order, x.id_product, x.nic, x.color, x.name, x.image, x.quantity, format(x.harga, 0) as price, format((x.quantity * x.harga), 0) as subtotal, y.sumqty, y.total, format(c.totalOngkir,0) as ongkir, c.weight FROM (SELECT a.id_order, a.id_product, b.name, b.nic, b.color, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x LEFT JOIN (SELECT id_order, sum(quantity)as sumqty, format(SUM(quantity * harga),0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ON x.id_order = y.id_order LEFT JOIN vh_order c ON x.id_order = c.id_order', [id, id]);
        if (product.length > 0) {
            return res.json(product);
        }
        res.status(404).json({text: "Order doesn't exists"});
    }

    public async getProductCartTotal(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT weight * (SELECT ongkir FROM vh_ongkir WHERE id = a.id_ongkir LIMIT 1) as ongkir FROM vh_order a WHERE a.id_order = ?', [id]);
        if (product.length > 0) {
            return res.json(product);
        }
        res.status(404).json({text: "Order doesn't exists"});
    }

    public async orderHeaderA(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const order =  await pool.query('SELECT x.id_order, x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, x.voucherid, format(x.amountvoucher, 0) as amountv, '+
        'case when d.vouchertab = "Amount" then format(d.vouchervalue, 0) '+
        'when d.vouchertab = "Percent" then format((z.total + y.Ongkir) * (d.vouchervalue * 0.01), 0) '+
        'end as harga_disc, '+
        '(SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = x.id_customer LIMIT 1) as customerName, '+
        'y.jenis, format(y.Ongkir, 0) as totalOngkir, y.courierName, format(z.total + y.Ongkir + x.payid , 0) as totalAmount '+
        'FROM vh_order x '+
        'LEFT JOIN '+
        '(SELECT a.id_order, b.jenis, (a.weight * b.ongkir) as Ongkir, c.name as courierName '+
        'FROM vh_order a '+
        'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id '+
        'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order '+
        'LEFT JOIN '+
        '(SELECT id_order ,SUM(harga * quantity) as total FROM vh_cart GROUP BY id_order) z ON x.id_order =  z.id_order '+
        'LEFT JOIN vh_voucher d ON x.voucherid = d.voucherid '+
        'WHERE x.id_order = ?', [id]);
            if (order.length > 0) {
            return res.json(order[0]);
        }
        res.status(404).json({text: "Order doesn't exists"})
    }

    public async orderHeaderB(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const order =  await pool.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, a.create_at, b.phone, b.address, '+
            'b.id_province, b.id_city, b.id_district, postal '+
            'FROM vh_customer a '+
            'LEFT JOIN vh_customer_info b '+
            'ON a.id = b.id_customer '+
            'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
        if (order.length > 0) {
            return res.json(order[0]);
        }
        res.status(404).json({text: "Order doesn't exists"})
    }

    public async orderDetail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        
        const order =  await pool.query('SELECT x.id, x.id_order, x.id_product, x.name as prodName, x.image, x.quantity, '+ 'x.weight, format(x.harga, 0) as price, y.total, format(x.harga * x.quantity, 0) as subTotal '+
        'FROM '+ 
        '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN '+ 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x '+ 
        'LEFT JOIN '+ 
        '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y '+ 
        'ON x.id_order = y.id_order', [id, id]);
        if (order.length > 0) {
            return res.json(order);
        }
        res.status(404).json({text: "Order doesn't exists"})
    }

    public async create(req: Request, res: Response): Promise<void> {
        const currentDate = new Date;
        currentDate.setDate(currentDate.getDate() + 1);

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
              }
              // console.log(order);
              for (let i = 0; i < req.body.PD.length; i++) {
                const cart = {
                  id_order: req.body.OI,
                }
                // console.log(cart);
                await pool.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.OI, req.body.PD[i].id]);
                await pool.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?',[req.body.PD[i].qty, req.body.PD[i].id_product]);
              }
              const date = dateFormat(new Date(), "yyyyMMdd");
              
              await pool.query('INSERT INTO vh_order set ?', order);
              res.json({message: 'Success'});
        } else {
            const order = {
                id_order: req.body.OI,
                id_customer: req.body.SD.id_customer,
                id_ongkir: req.body.PT.service,
                weight: req.body.PT.weight,
                // total: req.body.totalAmount,
                payment: req.body.PT.payment,
                status: 0,
                exp_date: currentDate,
                payid: req.body.PI,
                totalOngkir: req.body.TO,
                voucherid: req.body.VRI,
                amountvoucher: req.body.AV
              }
              const notif = {
                  id_order: req.body.OI,
                  flag: false
              }
              // console.log(order);
              for (let i = 0; i < req.body.PD.length; i++) {
                const cart = {
                  id_order: req.body.orderId,
                }
                const id = {
                    id: req.body.PD[i].id
                }
                // console.log(id);
                // console.log(cart);
                await pool.query('UPDATE vh_cart SET id_order = ? WHERE id = ?', [req.body.OI, req.body.PD[i].id]);
                await pool.query('UPDATE vh_product SET stock = stock - ? WHERE id = ?',[req.body.PD[i].qty, req.body.PD[i].id_product]);
              }
              
              await pool.query('INSERT INTO vh_order set ?', order);
              await pool.query('INSERT INTO vh_notiforder set ?', notif);
              res.json({message: 'Success'});
        }
        // Send Email
        async function main() {
            const customer = await pool.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal '+
            'FROM vh_customer a '+
            'LEFT JOIN vh_customer_info b '+
            'ON a.id = b.id_customer '+
            'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [req.body.OI]);
            const company = await pool.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
            const order = await pool.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, '+
            'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, format(x.amountvoucher, 0) as amounv '+
            'FROM vh_order x '+
            'LEFT JOIN '+
            '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName '+
            'FROM vh_order a '+
            'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id '+
            'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order '+
            'LEFT JOIN '+
            '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  '+'z.id_order '+
            'WHERE x.id_order = ?', [req.body.OI]);
            const carts = await pool.query('SELECT x.name as prodName, x.image, x.quantity, '+ 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal '+
            'FROM '+ 
            '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN '+ 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x '+ 
            'LEFT JOIN '+ 
            '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y '+ 
            'ON x.id_order = y.id_order', [req.body.OI, req.body.OI]);

           // create reusable transporter object using the default SMTP transport
           let transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false, // true for 465, false for other ports
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

        const amount = req.body.PD[0].totalOut +  req.body.TO;
        let potongan: number;
        potongan = 0;
        if (req.body.VR) {
            if (req.body.VR.vouchertab === 'Amount') {
                potongan = req.body.VR.vouchervalue;
            } else {
                potongan = amount * (req.body.VR.vouchervalue * 0.01);
            }
        }
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Vapehan Store" <shop@vapehan.com>', // sender address
            to: req.body.SD.email, // list of receivers
            subject: 'Checkout Order Detail', // Subject line
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
                virtual: '3124678649',
                custProv: req.body.AS.province,
                custCity: req.body.AS.city,
                cutDistrik: req.body.AS.subdistrict_name
            }
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        }

        main().catch(console.error);
        

    }
    public async resendemailOrder(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        // Send Email
        async function main() {
            const customer = await pool.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal '+
            'FROM vh_customer a '+
            'LEFT JOIN vh_customer_info b '+
            'ON a.id = b.id_customer '+
            'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
            const company = await pool.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
            const order = await pool.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, '+
            'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, (z.totalHarga + y.ongkir + x.payid) as Amount, format(x.amountvoucher, 0) as amounv, x.voucherid '+
            'FROM vh_order x '+
            'LEFT JOIN '+
            '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName '+
            'FROM vh_order a '+
            'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id '+
            'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order '+
            'LEFT JOIN '+
            '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  '+'z.id_order '+
            'WHERE x.id_order = ?', [id]);
            const carts = await pool.query('SELECT x.name as prodName, x.image, x.quantity, '+ 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal '+
            'FROM '+ 
            '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN '+ 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x '+ 
            'LEFT JOIN '+ 
            '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y '+ 
            'ON x.id_order = y.id_order', [id, id]);
            const voucher = await pool.query('SELECT * FROM vh_voucher WHERE voucherid = ? LIMIT 1', [order[0].voucherid]);

           // create reusable transporter object using the default SMTP transport
           let transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false, // true for 465, false for other ports
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

        const amount = +order[0].Amount - +order[0].payid;
        let potongan: number;

        if (voucher[0].vouchertab === 'Amount') {
            potongan = voucher[0].vouchervalue;
          } else {
            potongan = +amount * (voucher[0].vouchervalue * 0.01);
          }
          //  console.log(potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), voucher[0].vouchervalue)

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Vapehan Store" <shop@vapehan.com>', // sender address
            to: customer[0].email, // list of receivers
            subject: 'Checkout Order Detail', // Subject line
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

        }

        main().catch(console.error);
        res.json({ text: 'Success' });
    }

    public async sendInvoice(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        // Send Email
        async function main() {
            const customer = await pool.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal '+
            'FROM vh_customer a '+
            'LEFT JOIN vh_customer_info b '+
            'ON a.id = b.id_customer '+
            'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
            const company = await pool.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
            const order = await pool.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, '+
            'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, (z.totalHarga + y.ongkir + x.payid) as Amount, format(x.amountvoucher, 0) as amounv, x.voucherid '+
            'FROM vh_order x '+
            'LEFT JOIN '+
            '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName '+
            'FROM vh_order a '+
            'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id '+
            'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order '+
            'LEFT JOIN '+
            '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  '+'z.id_order '+
            'WHERE x.id_order = ?', [id]);
            const carts = await pool.query('SELECT x.name as prodName, x.image, x.quantity, '+ 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal '+
            'FROM '+ 
            '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN '+ 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x '+ 
            'LEFT JOIN '+ 
            '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y '+ 
            'ON x.id_order = y.id_order', [id, id]);
            const voucher = await pool.query('SELECT * FROM vh_voucher WHERE voucherid = ? LIMIT 1', [order[0].voucherid]);

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false, // true for 465, false for other ports
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

        const amount = +order[0].Amount - +order[0].payid;
        let potongan: number;

        if (voucher[0].vouchertab === 'Amount') {
            potongan = voucher[0].vouchervalue;
          } else {
            potongan = +amount * (voucher[0].vouchervalue * 0.01);
          }

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Vapehan Store" <shop@vapehan.com>', // sender address
            to: customer[0].email, // list of receivers
            subject: 'Invoice Order', // Subject line
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

        }

        main().catch(console.error);
        res.json({ text: 'Success' });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const order= await pool.query('SELECT id_order FROM vh_order WHERE id_order = ? LIMIT 1', [id]);
        await pool.query('UPDATE vh_order SET status = 6 WHERE id_order = ?', [id]);
        if (order== "") {
            res.status(404).json({ text: "Order doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }

    public async deleteImage(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const image = await pool.query('SELECT id FROM vh_order_image WHERE id = ?', [id]);
        await pool.query('DELETE FROM vh_order_image WHERE id = ?', [id]);
        if (image == "") {
            res.status(404).json({ text: "Order image doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
        
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const order = await pool.query('SELECT id FROM vh_order WHERE id = ?', [id]);
        await pool.query('UPDATE vh_order set ? WHERE id = ?', [req.body, id]);
        if(order == "") {
            res.status(404).json({ text: "Order doesn't exists" });
        } else {
            res.json({ message: 'The Order was Update' });
        }
        
    }

    public async updateStatus(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = {
            status : req.body.st
        }
        const order = await pool.query('SELECT id FROM vh_order WHERE id_order = ?', [id]);
        await pool.query('UPDATE vh_order set ? WHERE id_order = ?', [data, id]);
        if(order == "") {
            res.status(404).json({ text: "Order doesn't exists" });
        } else {
            res.json({ message: 'The Order was Update' });
        }
    }

    public async accPayment(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = {
            status : req.body.st
        }
        const order = await pool.query('SELECT id FROM vh_order WHERE id_order = ?', [id]);
        await pool.query('UPDATE vh_order set ? WHERE id_order = ?', [data, id]);
        await pool.query('UPDATE vh_confirm_order SET status = 1 WHERE transaction_id = ?', [id]);
        if(order == "") {
            res.status(404).json({ text: "Order doesn't exists" });
        } else {
            res.json({ message: 'The Order was Update' });
        }
        // Send Email
        async function main() {
            const customer = await pool.query('SELECT CONCAT(a.firstname," ",a.lastname) as custName, a.email, b.phone, b.address, postal '+
            'FROM vh_customer a '+
            'LEFT JOIN vh_customer_info b '+
            'ON a.id = b.id_customer '+
            'WHERE a.id in (SELECT id_customer FROM vh_order WHERE id_order = ?)', [id]);
            const company = await pool.query('SELECT compname, comphp, compemail, comppost, compcity, compprov, compaddress FROM vh_company_profile LIMIT 1');
            const order = await pool.query('SELECT x.payment, x.status, x.create_at, x.payid, x.weight as totalWeight, '+
            'y.jenis, y.totalOngkir, y.courierName, z.totalAmount, z.totalQTY, format(z.totalHarga + y.ongkir + x.payid, 0) as Total, (z.totalHarga + y.ongkir + x.payid) as Amount, format(x.amountvoucher, 0) as amounv, x.voucherid '+
            'FROM vh_order x '+
            'LEFT JOIN '+
            '(SELECT a.id_order, b.jenis, format((a.weight * b.ongkir), 0) as totalOngkir, (a.weight * b.ongkir) as ongkir, c.name as courierName '+
            'FROM vh_order a '+
            'LEFT JOIN vh_ongkir b ON a.id_ongkir = b.id '+
            'LEFT JOIN vh_courier c ON b.id_courier = c.id) y ON x.id_order = y.id_order '+
            'LEFT JOIN '+
            '(SELECT id_order ,format(SUM(harga * quantity), 0) as totalAmount, SUM(harga * quantity) as totalHarga, SUM(quantity) as totalQTY FROM vh_cart GROUP BY id_order) z ON x.id_order =  '+'z.id_order '+
            'WHERE x.id_order = ?', [id]);
            const carts = await pool.query('SELECT x.name as prodName, x.image, x.quantity, '+ 'x.weight, format(x.harga, 0) as price, format(x.harga * x.quantity, 0) as subTotal '+
            'FROM '+ 
            '(SELECT a.id ,a.id_order, a.id_product, b.weight, b.name, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN '+ 'vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x '+ 
            'LEFT JOIN '+ 
            '(SELECT id_order, format(SUM(quantity * harga), 0) as total FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y '+ 
            'ON x.id_order = y.id_order', [id, id]);
            const voucher = await pool.query('SELECT * FROM vh_voucher WHERE voucherid = ? LIMIT 1', [order[0].voucherid]);

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false, // true for 465, false for other ports
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

        const amount = +order[0].Amount - +order[0].payid;
        let potongan: number;

        if (voucher[0].vouchertab === 'Amount') {
            potongan = voucher[0].vouchervalue;
          } else {
            potongan = +amount * (voucher[0].vouchervalue * 0.01);
          }

          console.log(voucher[0].vouchertab);

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Vapehan Store" <shop@vapehan.com>', // sender address
            to: customer[0].email, // list of receivers
            subject: 'Payment Accepted', // Subject line
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
                virtual: '3124678649',
                date: dateFormat(new Date(), "dd-mmmm-yyyy")
            }
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        }

        main().catch(console.error);
        
    }

}

const ordercontroller = new OrderController();
export default ordercontroller;