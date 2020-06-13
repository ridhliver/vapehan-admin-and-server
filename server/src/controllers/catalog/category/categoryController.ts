import { Request, Response } from 'express';

import pool from '../../../database';

class CategoryController {

    public async list(req: Request, res: Response) {
        const category = await pool.query('SELECT * FROM vh_product_category');
        res.json(category);
    }

    public async catlist(req: Request, res: Response) {
        const category = await pool.query('SELECT * FROM vh_product_category WHERE id = 1 OR id_parent = 1');
        res.json(category);
    }

    public async catchild(req: Request, res: Response) {
        const category = await pool.query('SELECT id, name FROM vh_product_category WHERE id != 1 AND id_parent = 1', {"children" : {}});
        let cat = [];
        for (let i = 0; i < category.length; i++ ) {
            category[i].children = await pool.query('SELECT id, name FROM vh_product_category WHERE id_parent = ? ', [category[i].id , {"chilchildren" : {}}]);
            for (let i = 0; i < category[i].children[i].length; i++ ) {
                console.log('test');
                category[i].children[i].chilchildren = await pool.query('SELECT id, name FROM vh_product_category WHERE id_parent = ? ', [category[i].children[i].id]);
            }
        }
        res.json(category);
    }

    public async categorylist(req: Request, res: Response) {
        const category = await pool.query('SELECT * FROM vh_product_category WHERE id != 1');
        res.json(category);
    }

    public async listing(req: Request, res: Response) {
        const category = await pool.query('SELECT id, name, type, megaMenu, slug_url, image, id_parent FROM vh_product_category WHERE id != 1 AND id_parent = 1', {"children" : {}});
        for (let i = 0; i < category.length; i++ ) {
            category[i].children = await pool.query('SELECT id, name, type, megaMenu, slug_url, image, id_parent FROM vh_product_category WHERE id_parent = ?',[category[i].id]);
        }
        res.json(category);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const category = await pool.query('SELECT * FROM vh_product_category WHERE id = ?', [id]);
        if (category.length > 0) {
            return res.json(category[0]);
        }
        res.status(404).json({text: "Category doesn't exists"});
    }

    public async detailName(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const category = await pool.query('SELECT name FROM vh_product_category WHERE id = ?', [id]);
        if (category.length > 0) {
            return res.json(category[0]);
        }
        res.status(404).json({ text: "Category doesn't exists" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const data = {
            name: req.body.name,
            id_parent: req.body.id_parent,
            description: req.body.description,
            image: req.body.iamge,
            slug_url: req.body.slug_url,
            type: 'link',
        }
        await pool.query('INSERT INTO vh_product_category set ? ', [data]);
        res.json({message: 'Success'});
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const category = await pool.query('SELECT id FROM vh_product_category WHERE id = ? ', [id]);
        await pool.query('DELETE FROM vh_product_category WHERE id = ?', [id]);
        if (category == "") {
            res.status(404).json({ text: "Category doesn't exists"});
        } else {
            res.json({text: 'Success Delete'});
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const category = await pool.query('SELECT id FROM vh_product_category WHERE id = ?', [id]);
        await pool.query('UPDATE vh_product_category set ? WHERE id = ?', [req.body, id]);
        if(category == "") {
            res.status(404).json({ text: "Category doesn't exists"});
        } else {
            res.json({ message: 'The Category was Update'});
        }
    }
}

const categorycontroller = new CategoryController();
export default categorycontroller;
