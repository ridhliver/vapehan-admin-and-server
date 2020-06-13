import { Request, Response } from 'express';

import pool from '../../../database';

class VoucherController {

    public async list(req: Request, res: Response) {
        const voucher = await pool.query('SELECT *, format(vouchervalue, 0) as value, '+
        '(SELECT COUNT(voucherid) FROM vh_order WHERE voucherid = a.voucherid GROUP BY voucherid) as inuse '+
        'FROM vh_voucher a');
        res.json(voucher);
    }

    public async getVochActive(req: Request, res: Response) {
        const voucher = await pool.query('SELECT *, format(vouchervalue, 0) as value FROM vh_voucher WHERE status = 1');
        res.json(voucher);
    }

    public async detail(req: Request, res: Response) {
        const { id } = req.params;
        const voucher = await pool.query('SELECT * FROM vh_voucher WHERE voucherid = ? LIMIT 1', [id]);
        // console.log(id, voucher);
        res.json(voucher);
    }

    public async find(req: Request, res: Response) {
        const  data = {
            id : req.body.vid
        }

        try {
            const voucher = await pool.query('SELECT * FROM vh_voucher WHERE voucherid = ? AND status = 1 LIMIT 1', [data.id]);
            res.json(voucher[0]);
        } catch {
            res.json({ text: "Voucher doesnt exists"});
        }
        
    }

    public async create(req: Request, res: Response): Promise<void> {
        const post = req.body;
        const date = new Date();
        const data = {
            voucherid: post.voucherid,
            vouchername: post.vouchername,
            fromdate: post.fromdate,
            todate: post.todate,
            vouchervalue: post.vouchervalue,
            vouchertab: post.vouchertab,
            status: post.status,
            kouta: post.kouta,
            createdate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
            updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
        }
        // console.log(data);
		try {
			await pool.query('INSERT INTO vh_voucher set ? ', [data]);
			res.json({text: 'Success'})
		} catch (err) {
			res.json({text: 'failed'})
		}
        
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const voucher = await pool.query('SELECT id FROM vh_voucher WHERE id = ? ', [id]);
        await pool.query('DELETE FROM vh_voucher WHERE id = ?', [id]);
        if (voucher == "") {
            res.status(404).json({ text: "Voucher doesn't exists"});
        } else {
            res.json({text: 'Success Delete'});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const post = req.body;
        const date = new Date();
        const hdr = {
            id: post.id,
            voucherid: post.voucherid,
            vouchername: post.vouchername,
            fromdate: post.fromdate,
            todate: post.todate,
            vouchervalue: post.vouchervalue,
            vouchertab: post.vouchertab,
            status: post.status,
            kouta: post.kouta,
            updatedate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
        }
        console.log(hdr);
        const voucher = await pool.query('SELECT id FROM vh_voucher WHERE id = ?', [id]);
        await pool.query('UPDATE vh_voucher set ? WHERE id = ?', [hdr, id]);
        if(voucher == "") {
            res.status(404).json({ text: "Voucher doesn't exists"});
        } else {
            res.json({ message: 'The Voucher was Update'});
        }
    }

    public async updateStat(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const date = new Date();
        const data = {
            status : req.body.flag,
            updatedate : date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        }
        const voucher = await pool.query('SELECT voucherid FROM vh_voucher WHERE voucherid = ?', [id]);
        await pool.query('UPDATE vh_voucher set ? WHERE voucherid = ?', [data, id]);
        if(voucher == "") {
            res.status(404).json({ text: "Voucher doesn't exists"});
        } else {
            res.json({ message: 'The Voucher was Update'});
        }
    }
}

const vouchercontroller = new VoucherController();
export default vouchercontroller;
