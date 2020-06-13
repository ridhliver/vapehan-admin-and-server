import {Request, Response } from 'express';

import pool from '../../../database';

var nodemailer = require('nodemailer')


class CInvoiceController {

    public async list(req: Request, res: Response) {
        const { id } = req.params;
        const invoice = await pool.query('SELECT a.id, a.id_order, a.create_at, a.status, c.invoice, '+
        '(SELECT CONCAT(b.firstname," ",b.lastname) as name FROM vh_customer b WHERE a.id_customer = b.id LIMIT 1) as Cusname, '+
        '(SELECT resi FROM vh_shipping d WHERE a.id_order = d.id_order LIMIT 1) as resi '+
        'FROM vh_order a '+
        'LEFT JOIN vh_invoice c ON a.id_order = c.id_order '+
        'WHERE a.id_customer = ? AND c.invoice IS NOT NULL', [id]);
        res.json(invoice);
    }

    public async create(req: Request, res: Response): Promise<void> {
        const post = req.body;
        const customer = {
            firstname: post.firstname,
            lastname: post.lastname,
            email: post.email,
            verification: false,
            accessToken: post.accessToken,
            status: false
        }
    }

    /*
    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        await pool.query('CALL DeleteCustomer(?)', [id]);
        if (customer== "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }
    */

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const customer = await pool.query('SELECT id FROM vh_customer WHERE id = ?', [id]);
        await pool.query('UPDATE vh_customer set ? WHERE id = ?', [req.body, id]);
        if(customer == "") {
            res.status(404).json({ text: "Customer doesn't exists" });
        } else {
            res.json({ message: 'The Customer was Update' });
        }
        
    }

    
}

const Cinvoicecontroller = new CInvoiceController();
export default Cinvoicecontroller;