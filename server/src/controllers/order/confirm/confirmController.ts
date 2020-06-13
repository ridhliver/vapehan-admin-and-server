import {Request, Response } from 'express';

var globarUrl = 'http://192.168.1.160:4000/';

import pool from '../../../database';
var dateFormat = require('dateformat');

var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

class ConfirmController {

    public async list(req: Request, res: Response) {
        const confirm = await pool.query('SELECT *, format(total_amount,0) as harga FROM vh_confirm_order');
        res.json(confirm);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const confirm = await pool.query('SELECT *, format(total_amount,0) as harga FROM vh_confirm_order WHERE transaction_id = ?', [id]);
        if (confirm.length > 0) {
            return res.json(confirm);
        }
        res.status(404).json({text: "Confirm doesn't exists "});
    }

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
        // console.log(confirm);
        await pool.query('INSERT INTO vh_confirm_order (transaction_id, total_amount, first_name, last_name, date_payment, payment, virtual_account, note) VALUES (?, replace(?, ",", ""),?, ? , ?, ?, ?, ?)', [confirm.transaction_id, confirm.total_amount, confirm.first_name, confirm.last_name, confirm.date_payment, confirm.payment, confirm.virtual_account, confirm.note]);
        await pool.query('UPDATE vh_order SET status = 4 WHERE id_order = ?', confirm.transaction_id);
        res.json({message: 'Success'});
    }

    public async onProcess(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const status = {
            status : req.body.status,
        }
        await pool.query('UPDATE vh_order set ? WHERE id_order =?', [status, id]);
        await pool.query('UPDATE vh_confirm_order set ? WHERE transaction_id =?', [status, id]);
        const invoice = {
            invoice: req.body.invoice,
            id_order: req.body.id_order,
            create_at: req.body.create_at
        }
        await pool.query('INSERT INTO vh_invoice set ?', invoice);
        res.json({message: 'Success'});
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
                invoice: req.body.invoice,
                cart: carts,
                company: company[0],
                order: order[0],
                voucher: order[0].voucherid,
                discount: potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                amountVoucher: order[0].amounv,
                customer: customer[0],
                custProv: req.body.address.province,
                custCity: req.body.address.city,
                cutDistrik: req.body.address.subdistrict_name,
                date: req.body.create_at
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

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const order= await pool.query('SELECT id FROM vh_confirm_order WHERE id = ? LIMIT 1', [id]);
        await pool.query('DELETE FROM vh_confirm_order WHERE id = ?', [id]);
        if (order== "") {
            res.status(404).json({ text: "Order Confirm doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }


}

const confirmcontroller = new ConfirmController();
export default confirmcontroller;