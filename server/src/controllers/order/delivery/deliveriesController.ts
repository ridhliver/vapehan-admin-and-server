import {Request, Response } from 'express';

import pool from '../../../database';
import { reduce } from 'bluebird';

class DeliveryController {

    public async list(req: Request, res: Response) {
        const { id } = req.params;
        const delivery = await pool.query('SELECT resi, status FROM vh_shipping');
        res.json(delivery);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const delivery = await pool.query('SELECT * FROM vh_order WHERE id_customer = ?', [id]);
        if (delivery.length > 0) {
            return res.json(delivery);
        }
        res.status(404).json({text: "Delivery doesn't exists "});
    }

    public async shipping(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const shipping = await pool.query('SELECT * FROM vh_shipping WHERE id_order = ?', [id]);
        if (shipping.length > 0) {
            return res.json(shipping[0]);
        }
        res.status(404).json({text: "Delivery doesn't exists "});
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

    public async create(req: Request, res: Response): Promise<void> {
        const delivery = {
            resi: req.body.rest,
            // id_ongkir: req.body.id_ongkir,
            id_order: req.body.id_order,
            id_invoice: req.body.id_invoice,
            // id_customer: req.body.id_customer
            status: 0
        }
        const status = {
            status: req.body.status
        }
        // console.log(delivery);
        await pool.query('INSERT INTO vh_shipping set ?', delivery);
        await pool.query('UPDATE vh_order set ? WHERE id_order = ?', [status, req.body.id_order]);
        res.json({message: 'Success'});
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const delivery= await pool.query('SELECT id FROM vh_order WHERE id = ?', [id]);
        await pool.query('DELETE vh_order, vh_cart FROM vh_order INNER JOIN vh_cart ON vh_order.id_order = vh_cart.id_order WHERE vh_order.id = ?', [id]);
        if (delivery== "") {
            res.status(404).json({ text: "Order doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const delivery = await pool.query('SELECT id FROM vh_order WHERE id = ?', [id]);
        await pool.query('UPDATE vh_order set ? WHERE id = ?', [req.body, id]);
        if(delivery == "") {
            res.status(404).json({ text: "Delivery doesn't exists" });
        } else {
            res.json({ message: 'The Delivery was Update' });
        }
        
    }

    public async Done(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const order = {
            status: req.body.order
        }

        const shipping = {
            status: req.body.shipping
        }
        const delivery = await pool.query('SELECT id_order FROM vh_shipping WHERE id_order = ?', [id]);
        await pool.query('UPDATE vh_shipping set ? WHERE id_order = ?', [shipping, id]);
        await pool.query('UPDATE vh_order set ? WHERE id_order = ?', [order, id]);
        if(delivery == "") {
            res.status(404).json({ text: "Delivery doesn't exists" });
        } else {
            res.json({ message: 'The Delivery was Update' });
        }
        
    }

}

const deliverycontroller = new DeliveryController();
export default deliverycontroller;