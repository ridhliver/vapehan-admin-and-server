import {Request, Response } from 'express';

import pool from '../../database';

import md5 from 'md5';

var nodemailer = require('nodemailer')


class DistributorController {

    public async list(req: Request, res: Response) {
        const customer = await pool.query('SELECT * FROM vh_distributor ORDER BY id DESC');
        res.json(customer);
    }

    public async create(req: Request, res: Response): Promise<void> {
       
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const distributor = await pool.query('SELECT id FROM vh_distributor WHERE id = ? ', [id]);
        await pool.query('DELETE FROM vh_distributor WHERE id = ?', [id]);
        if (distributor == "") {
            res.status(404).json({ text: "Distributor doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
        }
    }

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

    public async updateFlag(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = {
            flag_stat: req.body.flag
        }
        const distributor = await pool.query('SELECT id FROM vh_distributor WHERE id = ?', [id]);
        await pool.query('UPDATE vh_distributor set ? WHERE id = ?', [data, id]);
        if(distributor == "") {
            res.status(404).json({ text: "Distributor doesn't exists" });
        } else {
            res.json({ message: 'The Distributor was Update' });
        }
        
    }

}

const distributorcontroller = new DistributorController();
export default distributorcontroller;