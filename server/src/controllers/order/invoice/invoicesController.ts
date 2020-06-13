import {Request, Response } from 'express';

import pool from '../../../database';

class InvoiceController {

    public async list(req: Request, res: Response) {
        const invoice = await pool.query('SELECT a.*, (SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id in (SELECT id_customer FROM vh_order WHERE id_order = a.id_order)) as custName, (SELECT status from vh_order WHERE id_order = a.id_order) as stat FROM vh_invoice a');
        res.json(invoice);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const invoice = await pool.query('SELECT invoice, id_order FROM vh_invoice WHERE invoice= ? LIMIT 1', [id]);
        if (invoice.length > 0) {
            return res.json(invoice[0]);
        }
        res.status(404).json({text: "Invoice doesn't exists "});
    }

    public async listvouch(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const invoice = await pool.query('SELECT a.id, a.id_order, a.status as stat, a.create_at, b.invoice, '+
        '(SELECT CONCAT(firstname," ",lastname) FROM vh_customer WHERE id = a.id_customer) as custName '+
        'FROM vh_order a '+
        'LEFT JOIN vh_invoice b ON a.id_order = b.id_order '+
        'WHERE a.voucherid = ?', [id]);
        // console.log(invoice);
        return res.json(invoice);
    }

    public async detailInvoice(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const invoice = await pool.query('SELECT q.id_order, q.invoice, q.create_at as date_order, w.id_product, w.name, w.quantity, w.price, w.subtotal, format(w.totalOngkir,0) as ongkir, w.weight, w.payid, w.color, w.nic, '+
        'w.payment, w.namaongkir, w.ongkirService, w.id_customer, format(w.totalpay,0) as total, format((w.totalpay + w.totalOngkir + w.payid), 0) totalall, w.voucherid, format(w.amountvoucher, 0) as amountv, w.vouchername, '+
            'case when w.vouchertab = "Amount" then format(w.vouchervalue, 0) '+
            'when w.vouchertab = "Percent" then format((w.totalpay + w.totalOngkir) * (w.vouchervalue * 0.01), 0) '+
            'end as harga_disc '+
        'FROM vh_invoice q '+
        'INNER JOIN '+
        '(SELECT x.id_order, x.id_product, x.name, x.color, x.nic, x.quantity, format(x.harga, 0) as price, format((x.quantity * x.harga), 0) as subtotal, y.totalpay, c.id_customer, c.totalOngkir, c.payment, c.weight, c.payid, c.voucherid, c.amountvoucher, d.vouchername, d.vouchertab, d.vouchervalue, (SELECT name FROM vh_courier WHERE id in (SELECT id_courier FROM vh_ongkir WHERE id = c.id_ongkir) LIMIT 1) as namaongkir, (SELECT jenis FROM vh_ongkir WHERE id = c.id_ongkir) as ongkirService FROM (SELECT a.id_order, a.id_product, b.name, b.color, b.nic, b.image, a.quantity, a.harga FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id WHERE a.id_order in ( ? )) x LEFT JOIN (SELECT id_order, sum(quantity)as sumqty, SUM(quantity * harga) as totalpay FROM vh_cart WHERE id_order = ? GROUP BY  id_order) y ON x.id_order = y.id_order LEFT JOIN vh_order c ON x.id_order = c.id_order LEFT JOIN vh_voucher d ON c.voucherid = d.voucherid) w ON q.id_order = w.id_order', [id, id]);
        if (invoice.length > 0) {
            return res.json(invoice);
        }
        res.status(404).json({text: "Invoice doesn't exists "});
    }

    public async create(req: Request, res: Response): Promise<void> {
        const order = {
            
        }

        await pool.query('INSERT INTO vh_order set ?', order);
        res.json({message: 'Success'});
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const invoice= await pool.query('SELECT id FROM vh_invoice WHERE id = ?', [id]);
        await pool.query('DELETE FROM vh_invoice WHERE id = ?', [id]);
        if (invoice== "") {
            res.status(404).json({ text: "Invoice doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const invoice = await pool.query('SELECT id FROM vh_order WHERE id = ?', [id]);
        await pool.query('UPDATE vh_order set ? WHERE id = ?', [req.body, id]);
        if(invoice == "") {
            res.status(404).json({ text: "Invoice doesn't exists" });
        } else {
            res.json({ message: 'The Invoice was Update' });
        }
        
    }

}

const invoicecontroller = new InvoiceController();
export default invoicecontroller;