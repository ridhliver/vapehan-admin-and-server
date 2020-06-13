import { Request, Response } from 'express';

import pool from '../../../database';

class BrandController {

    public async list(req: Request, res: Response) {
        const brand = await pool.query('SELECT * FROM vh_product_brand');
        return res.json(brand);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const brand = await pool.query('SELECT * FROM vh_product_brand WHERE id = ?', [id]);
        if (brand.length > 0) {
            return res.json(brand[0]);
        }
        res.status(404).json({ text: "Brand doesn't exists" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO vh_product_brand set ? ', [req.body]);
        res.json({ message: 'Success' });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const brand = await pool.query('SELECT id FROM vh_product_brand WHERE id = ? ', [id]);
        await pool.query('DELETE FROM vh_product_brand WHERE id = ?', [id]);
        if (brand == "") {
            res.status(404).json({ text: "Brand doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const brand = await pool.query('SELECT id FROM vh_product_brand WHERE id = ?', [id]);
        await pool.query('UPDATE vh_product_brand set ? WHERE id = ?', [req.body, id]);
        if (brand == "") {
            res.status(404).json({ text: "Brand doesn't exists" });
        } else {
            res.json({ message: 'The Brand was Update' });
        }
    }
}

const brandcontroller = new BrandController();
export default brandcontroller;