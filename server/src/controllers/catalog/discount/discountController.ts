import { Request, Response } from 'express';

import pool from '../../../database';

class DiscountController {

    public async list(req: Request, res: Response) {
        const discount = await pool.query('SELECT *, format(discount, 0) as value FROM vh_discount_reg_hdr');
        res.json(discount);
    }

    public async generate(req: Request, res: Response) {
        const generate = await pool.query('SELECT MAX(number) as no FROM vh_numbersequence WHERE kode = "DS" LIMIT 1');
        res.json(generate[0]);
    }

    public async create(req: Request, res: Response): Promise<void> {
        const post = req.body;
        const date = new Date();
        const data = {
            id: post.id,
            kode_disc: post.kode_disc,
            description: post.description,
            from_date: post.from_date,
            to_date: post.to_date,
            discount: post.discount,
            flag_discount: post.flag_discount,
            status: post.status,
            create_by: post.create_by,
            date_create: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
            time_create: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        }
        //console.log(data);
        try {
			await pool.query('INSERT INTO vh_discount_reg_hdr set ? ', [data]);
            await pool.query('UPDATE vh_numbersequence set number = number + 1');
            res.json({message: 'Success'});
		} catch (err) {
			res.json({text: 'failed'})
		}
    }

    public async addDisc(req: Request, res: Response): Promise<void> {
        const post = req.body;
        for (let i = 0; i < post.i_p.length; i++ ) {
            const dtl = {
                kode_disc: post.kd_dsc,
                id_product: post.i_p[i],
                discountvalue: post.value,
                discounttab: post.flg
            }
            await pool.query('INSERT INTO vh_discount_reg_dtl set ?', [dtl]);
        }

        res.json({message: 'Success'});
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const discount = await pool.query('SELECT id FROM vh_discount_reg_hdr WHERE id = ? ', [id]);
        await pool.query('CALL CancelDiscount(?)', [id]);
        if (discount == "") {
            res.status(404).json({ text: "Discount doesn't exists"});
        } else {
            res.json({text: 'Success Delete'});
        }
    }

    public async dropProduct(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const discount = await pool.query('SELECT id_product FROM vh_discount_reg_dtl WHERE id_product = ? ', [id]);
        await pool.query('DELETE FROM vh_discount_reg_dtl WHERE id_product = ?', [id]);
        if (discount == "") {
            res.status(404).json({ text: "Discount doesn't exists"});
        } else {
            res.json({text: 'Success Delete'});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const post = req.body;
        const hdr = {
            id: post.id,
            kode_disc: post.kode_disc,
            description: post.description,
            from_date: post.from_date,
            to_date: post.to_date,
            discount: post.discount,
            flag_discount: post.flag_discount,
            status: post.status,
            create_by: post.create_by,
        }
        // console.log(hdr);
        const discount = await pool.query('SELECT kode_disc FROM vh_discount_reg_hdr WHERE kode_disc = ?', [hdr.kode_disc]);
        await pool.query('UPDATE vh_discount_reg_hdr set ? WHERE id = ?', [hdr, id]);
        if(discount == "") {
            res.status(404).json({ text: "Discount doesn't exists"});
        } else {
            res.json({ message: 'The Discount was Update'});
        }
    }

    public async updateStat(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const data = {
            status : req.body.flag,
            date_create: req.body.tgl,
            time_create: req.body.tm
        }
        const discount = await pool.query('SELECT id FROM vh_discount_reg_hdr WHERE kode_disc = ?', [id]);
        await pool.query('UPDATE vh_discount_reg_hdr set ? WHERE kode_disc = ?', [data, id]);
        if(discount == "") {
            res.status(404).json({ text: "Discount doesn't exists"});
        } else {
            res.json({ message: 'The Discount was Update'});
        }
    }
}

const discountcontroller = new DiscountController();
export default discountcontroller;
