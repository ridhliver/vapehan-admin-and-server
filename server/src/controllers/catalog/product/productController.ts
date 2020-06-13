import {Request, Response } from 'express';

import pool from '../../../database';

class ProductController {

    public async list(req: Request, res: Response) {
        const product = await pool.query('SELECT *, format(price,0) as harga, IF (discountvalue = "" OR discountvalue is null, 0, format(discountvalue, 0)) as discValue FROM vh_product');
        res.json(product);
    }

    public async plist(req: Request, res: Response) {
        const product = await pool.query('SELECT a.*, format(a.price,0) as harga, b.kode_disc '+
        'FROM vh_product a '+
        'LEFT JOIN vh_discount_reg_dtl b ON a.id = b.id_product '+
        'where (b.kode_disc is null or b.kode_disc = "") and a.status = 1 and a.stock > 0');
        res.json(product);
    }

    public async plistd(req: Request, res: Response) {
        const { id } = req.params
        const product = await pool.query('SELECT a.*, format(a.price,0) as harga, b.kode_disc FROM vh_product a LEFT JOIN vh_discount_reg_dtl b ON a.id = b.id_product where b.kode_disc = ?', [id]);
        res.json(product);
    }

    public async categories(req: Request, res: Response) {
        const { id } = req.params;
        const category = await pool.query('SELECT id FROM vh_product_category WHERE slug_url = ? LIMIT 1',[id])
        const categories = await pool.query('select *, '+
        'case when discounttab = "Amount" then price  - discountvalue '+
                 'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
        'end as harga_disc, '+
        'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
                 'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
        'end as discount '+
        'from '+
        '(SELECT a.id, a.nic, a.color, a.name, a.stock, a.price, a.image, a.slug_url, format(a.price,0) as harga, b.id_parent, b.image as imageCat, b.name as nameCat, '+
                'case when x.discountvalue is null or x.discountvalue = "" or x.discountvalue < 1 then ifnull(a.discountvalue, 0) else ifnull(x.discountvalue, 0) end as discountvalue, '+
                'case when x.discountvalue is null or x.discountvalue = "" or x.discountvalue < 1 then ifnull(a.discounttype, 0) else ifnull(x.discounttab, 0) end as discounttab '+
                'FROM vh_product a '+
                'LEFT JOIN vh_product_category b ON a.id_category = b.id '+
                'LEFT JOIN  '+
                '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab '+  
                'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
                'ON b.kode_disc = c.kode_disc  '+
                'WHERE b.status = 1 GROUP BY id_product) x  '+
                'ON a.id = x.id_product '+
                'WHERE a.id_category = ? OR b.id_parent = ? AND a.status = 1 )z', [category[0].id, category[0].id]);
        res.json(categories);
    }

    public async ListPro(req: Request, res: Response) {
        const product = await pool.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga FROM vh_product WHERE status = 1');
        res.json(product);
    }

    public async ImageVariant(req: Request, res: Response): Promise<any> {
        const product = await pool.query('SELECT id, image FROM vh_product '+
         'UNION '+ 
         'SELECT id_product, image FROM vh_product_image');
         // console.log(product);
        res.json(product);
    }

    public async Homenew(req: Request, res: Response) {
        const product = await pool.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, '+
        '(SELECT COUNT(id) FROM (SELECT id, '+ 
        'case when DATEDIFF( CURDATE(),create_at) between 0 and 7 then "New" else kondisi end as flag '+
        'FROM vh_product)y WHERE flag = "New") as lenght '+
        'FROM '+
        '(SELECT *, '+
        'case when DATEDIFF( CURDATE(),create_at) between 0 and 7 then "New" else kondisi end as flag '+
        'FROM vh_product)x '+
        'WHERE flag = "New"');
        res.json(product);
    }

    public async Homebest(req: Request, res: Response) {
        const product = await pool.query('select *, '+
			'case when discounttab = "Amount" then price  - discountvalue '+
					 'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
			'end as harga_disc, '+
			'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
					 'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
			'end as discount '+
            'from '+
            '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, '+
            'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, '+
            'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab, '+
            '(SELECT COUNT(id) FROM (SELECT id,  '+
            'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag '+
            'FROM vh_product)y WHERE flag = "BestSeller") as lenght '+
            'FROM '+
            '(SELECT *, '+
            'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag '+
            'FROM vh_product WHERE status = 1)x '+
            'LEFT JOIN  '+
                        '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab '+  
                        'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
                        'ON b.kode_disc = c.kode_disc  '+
                        'WHERE b.status = 1 GROUP BY id_product) y  '+
                        'ON x.id = y.id_product '+
            'WHERE flag = "BestSeller" ) z');
        res.json(product);
    }
    
    public async BestProd(req: Request, res: Response) {
        const product = await pool.query('select *, '+
        'case when discounttab = "Amount" then price  - discountvalue '+
                 'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
        'end as harga_disc, '+
        'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
                 'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
        'end as discount '+
        'from '+
        '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, '+
        'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, '+
        'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab, '+
        '(SELECT COUNT(id) FROM (SELECT id,  '+
        'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag '+
        'FROM vh_product)y WHERE flag = "BestSeller") as lenght '+
        'FROM '+
        '(SELECT *, '+
        'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag '+
        'FROM vh_product WHERE status = 1)x '+
        'LEFT JOIN  '+
                    '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab '+  
                    'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
                    'ON b.kode_disc = c.kode_disc  '+
                    'WHERE b.status = 1 GROUP BY id_product) y  '+
                    'ON x.id = y.id_product '+
        'WHERE flag = "BestSeller" ORDER BY id DESC LIMIT 0, 3) z');
        res.json(product);
	}
	
	public async Homefeat(req: Request, res: Response) {
        const product = await pool.query('select a.id_product as id,  b.nic, b.color, b.slug_url as slug, b.name, b.stock, b.image, b.price, format(b.price,0) as harga, a.discountvalue, a.discounttab, '+
        'case when a.discounttab = "Amount" then b.price  - a.discountvalue '+
		    'when a.discounttab = "Percent" then b.price - (b.price * (a.discountvalue * 0.01)) '+
        'end as harga_disc, '+
       'case when a.discounttab = "Amount" then format(b.price  - a.discountvalue, 0) '+
                 'when a.discounttab = "Percent" then format(b.price - (b.price * (a.discountvalue * 0.01)), 0) '+
        'end as discount, '+
        '(select count(id) from vh_discount_reg_dtl '+
            'where kode_disc in (select kode_disc from vh_discount_reg_hdr where status = 1)) as lenght '+
        'from vh_discount_reg_dtl a left join vh_product b '+
        'on a.id_product = b.id '+
        'where kode_disc in (select kode_disc from vh_discount_reg_hdr where status = 1)');
        res.json(product);
    }

    public async Imagelist(req: Request, res: Response) {
        const { id } = req.params;
        const product = await pool.query('SELECT * FROM vh_product_image WHERE id_product = ?', [id]);
        res.json(product);
    }

    public async detailProduct(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT a.id, a.name, a.summary, a.description, a.stock, a.price, format(a.price, 0) as harga, a.image, a.width, a.height, a.depth, a.weight, a.video, a.id_category, b.name as catName FROM vh_product a LEFT JOIN vh_product_category b ON a.id_category = b.id WHERE a.id = ? LIMIT 1', [id]);
        if (product.length > 0) {
            return res.json(product[0]);
        }
        res.status(404).json({text: "Product doesn't exists "});
    }

    public async detailProductSlug(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('select *, '+
        'case when discounttab = "Amount" then price  - discountvalue '+
                 'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
        'end as harga_disc, '+
        'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
                 'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
        'end as discount '+
        'from '+
        '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, x.status, x.summary, x.description, x.width, x.height, x.depth, x.weight, x.video, x.id_category, x.catName, '+
        'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, '+
        'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab '+
        'FROM '+
        '(SELECT a.*, d.name as catName '+
        'FROM vh_product a '+
				'LEFT JOIN vh_product_category d  '+
        'ON a.id_category = d.id '+
				'WHERE status = 1)x '+
        'LEFT JOIN  '+
                    '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab   '+
                    'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
                    'ON b.kode_disc = c.kode_disc  '+
                    'WHERE b.status = 1 GROUP BY id_product) y  '+
                    'ON x.id = y.id_product '+
        'WHERE x.slug_url = ? LIMIT 1) z', [id]);
        if (product.length > 0) {
            return res.json(product[0]);
        }
        res.status(404).json({text: "Product doesn't exists "});
    }

    public async getVariantImage(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT image FROM vh_product WHERE id = ? '+
         'UNION '+ 
         'SELECT image FROM vh_product_image WHERE id_product = ?', [id, id]);
         // console.log(product);
        res.json(product);
    }

    public async detail(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT * FROM vh_product WHERE id = ? LIMIT 1', [id]);
        if (product.length > 0) {
            return res.json(product[0]);
        }
        res.status(404).json({text: "Product doesn't exists "});
    }

    public async search(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('select *, '+
        'case when discounttab = "Amount" then price  - discountvalue '+
                 'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
        'end as harga_disc, '+
        'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
                 'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
        'end as discount '+
        'from '+
        '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, '+
        'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, '+
        'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab '+
        'FROM '+
        '(SELECT * FROM vh_product)x '+
        'LEFT JOIN  '+
                    '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab   '+
                    'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
                    'ON b.kode_disc = c.kode_disc  '+
                    'WHERE b.status = 1 GROUP BY id_product) y  '+
                    'ON x.id = y.id_product '+
        'WHERE x.status = 1 AND x.name LIKE ?) z', '%' + [id] + '%');
        
            return res.json(product);
    }

    public async getLastIDProduct(req: Request, res: Response) {
        const product = await pool.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
        res.json(product[0]);
    }

    public async create(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO vh_product set ?', [req.body]);
        res.json({message: 'Success'});
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT id FROM vh_product WHERE id = ?', [id]);
        await pool.query('DELETE FROM vh_product WHERE id = ?', [id]);
        if (product == "") {
            res.status(404).json({ text: "Product doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });

        }
    }

    public async deleteImage(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const image = await pool.query('SELECT id FROM vh_product_image WHERE id = ?', [id]);
        await pool.query('DELETE FROM vh_product_image WHERE id = ?', [id]);
        if (image == "") {
            res.status(404).json({ text: "Product image doesn't exists" });
        } else {
            res.json({ text: 'Success Delete' });

        }

    }

    public async update(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT id FROM vh_product WHERE id = ?', [id]);
        const post = req.body;

            const data = {
                barcode: post.barcode,
                name: post.name,
                id_category: post.id_category,
                id_brand: post.id_brand,
                summary: post.summary,
                description: post.description,
                stock: post.stock,
                price: post.price,
                color: post.color,
                status: post.status,
                kondisi: post.kondisi,
                width: post.width,
                height: post.height,
                depth: post.depth,
                weight: post.weight,
                home: post.home,
                video: post.video,
                slug_url: post.slug
            }
        await pool.query('UPDATE vh_product SET barcode = ?, name = ?, id_category = ?, id_brand = ?, summary = ?, description = ?, stock = ?, price = ?,	color = ?, status = ?, kondisi = ?, width = ?, height = ?, depth = ?, weight = ?, home = ?, video = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [data.barcode, data.name, data.id_category, data.id_brand, data.summary, data.description, data.stock, data.price, data.color, data.status, data.kondisi, data.width, data.height, data.depth, data.weight, data.home, data.video, data.slug_url, id]);
        if(product == "") {
            res.status(404).json({ text: "Product doesn't exists" });
        } else {
            res.json({ message: 'The Product was Update' });
        }
    }

    public async updateCondition(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT id FROM vh_product WHERE id = ?', [id]);
        const post = req.body;

            const data = {
                kondisi: post.kondisi,
            }
        await pool.query('UPDATE vh_product SET kondisi = ? WHERE id = ?', [ data.kondisi, id]);
        if(product == "") {
            res.status(404).json({ text: "Product doesn't exists" });
        } else {
            res.json({ message: 'The Product was Update' });
        }
    }

    public async updateDiscount(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT id FROM vh_product WHERE id = ?', [id]);
        const post = req.body;
            const data = {
                discountvalue: post.dv,
                discounttype: post.flg
            }
        await pool.query('UPDATE vh_product SET ? WHERE id = ?', [ data, id]);
        if(product == "") {
            res.status(404).json({ text: "Product doesn't exists" });
        } else {
            res.json({ message: 'The Product was Update' });
        }
    }

    public async updateStatus(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT id FROM vh_product WHERE id = ?', [id]);
        const post = req.body;

            const data = {
                status: post.st,
            }
        await pool.query('UPDATE vh_product SET status = ? WHERE id = ?', [ data.status, id]);
        if(product == "") {
            res.status(404).json({ text: "Product doesn't exists" });
        } else {
            res.json({ message: 'The Product was Update' });
        }
    }

    public async updateHome(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const product = await pool.query('SELECT id FROM vh_product WHERE id = ?', [id]);
        const post = req.body;

            const data = {
                home: post.hm,
            }
        await pool.query('UPDATE vh_product SET home = ? WHERE id = ?', [ data.home, id]);
        if(product == "") {
            res.status(404).json({ text: "Product doesn't exists" });
        } else {
            res.json({ message: 'The Product was Update' });
        }
    }

}

const productcontroller = new ProductController();
export default productcontroller;
