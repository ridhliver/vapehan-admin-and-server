import {Request, Response } from 'express';

import pool from '../../../database';


class CartController {

    public async list(req: Request, res: Response) {
        const cart = await pool.query('SELECT *, format(total,0) as harga FROM vh_cart');
        res.json(cart);
    }

    public async updateqtyProductinc(req: Request, res: Response) {
        const { id } = req.params;
        const cart = await pool.query('UPDATE vh_cart set quantity = quantity + 1 WHERE id = ?', [id]);
        res.json(cart[0]);
    }

    public async updateqtyProductdec(req: Request, res: Response) {
        const { id } = req.params;
        const cart = await pool.query('UPDATE vh_cart set quantity = quantity - 1 WHERE id = ?', [id]);
        res.json(cart[0]);
    }

    public async getCart(req: Request, res: Response) {
        const { id } = req.params;
        // console.log(id);
        const cart = await pool.query('select i.*, '+
        'if(i.totweight <= i.flag, round(i.totweight), ceil(i.totweight)) as totalweight '+
        'from '+
        '(SELECT x.*, (select param from vh_paramweight where param = x.totweight limit 1) as flag '+
        'from '+
        '( '+
          'SELECT a.id, b.stock, a.id_customer, b.name as prodName, b.nic, a.quantity as qty, format(a.harga,0) as price, b.image, a.id_product, b.color, c.totalqty, c.total, c.totalOut, format(a.quantity * a.harga, 0) as harga, '+
          'format((SELECT SUM(b.weight * a.quantity) as totalWeight FROM vh_cart a LEFT JOIN vh_product b on a.id_product = b.id WHERE a.id_customer = ? AND (a.id_order = "" OR a.id_order is null) GROUP BY a.id_customer), 1) as totweight '+
          'FROM vh_cart a LEFT JOIN vh_product b ON a.id_product = b.id '+
          'LEFT JOIN (SELECT id_customer, SUM(quantity) as totalqty, format(SUM(quantity*harga),0) as total, SUM(quantity*harga) as totalOut '+
          'FROM vh_cart WHERE id_customer = ? AND (id_order = "" OR id_order is null) GROUP BY id_customer) c ON a.id_customer = c.id_customer '+
          'WHERE a.id_customer = ? AND (a.id_order = "" OR a.id_order is null) '+
        ') x )i', [id, id, id]);
        if (cart.length > 0) {
            return res.json(cart);
        }
        res.json(cart);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const cart = await pool.query('SELECT * FROM vh_cart WHERE id = ?', [id]);
        if (cart.length > 0) {
            return res.json(cart[0]);
        }
        res.status(404).json({text: "Cart doesn't exists "});
    }

    public async create(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO vh_cart set ?', [req.body]);
        res.json({message: 'Success'});
    }

    public async createCart(req: Request, res: Response): Promise<void> {
        
        const data = {
            id_customer: req.body.id_customer,
            id_product: req.body.id_product,
            quantity: req.body.quantity,
            harga: req.body.harga
        }
       // console.log(data);
        await pool.query('INSERT INTO vh_cart (id, id_customer, id_product, quantity, harga) VALUES (null, ?, ?, ?, ?)', [data.id_customer, data.id_product, data.quantity, data.harga]);
        res.json({message: 'Success'});
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const cart = await pool.query('SELECT id FROM vh_cart WHERE id = ?', [id]);
        await pool.query('DELETE FROM vh_cart WHERE id = ?', [id]);
        if (cart== "") {
            res.status(404).json({ text: "Cart doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<any> {
        const { id } = req.params;        
        const cart = await pool.query('SELECT id_product FROM vh_cart WHERE id = ?', [id]);
        await pool.query('DELETE FROM vh_cart WHERE id = ?', [id]);
        if (cart== "") {
            res.status(404).json({ text: "Cart doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
            
        }
    }


    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const cart = await pool.query('SELECT id FROM vh_cart WHERE id = ?', [id]);
        await pool.query('UPDATE vh_cart set ? WHERE id = ?', [req.body, id]);
        if(cart == "") {
            res.status(404).json({ text: "Cart doesn't exists" });
        } else {
            res.json({ message: 'The Cart was Update' });
        }
        
    }

}

const cartcontroller = new CartController();
export default cartcontroller;