"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../database"));
class ProductController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT a.*, LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(a.slug_url,".","_"), "-&-", "_"), " ", "-"), ")", "_"), "(", "_"), "+", "_"), "--", "-"), "-_-", "_"), "-_", "_"), "_-", "")) as flagName, format(a.price,0) as harga, IF (a.discountvalue = "" OR a.discountvalue is null, 0, format(a.discountvalue, 0)) as discValue, b.name as Bname '+
            'FROM vh_product a '+
            'LEFT JOIN vh_product_brand b '+
            'ON a.id_brand = b.id '+
            'WHERE status != 2');
            res.json(product);
        });
    }
    plist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT a.*, format(a.price,0) as harga, b.kode_disc ' +
                'FROM vh_product a ' +
                'LEFT JOIN vh_discount_reg_dtl b ON a.id = b.id_product ' +
                'where (b.kode_disc is null or b.kode_disc = "") and a.status = 1 and a.stock > 0');
            res.json(product);
        });
    }
    plistd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT a.*, format(a.price,0) as harga, b.kode_disc FROM vh_product a LEFT JOIN vh_discount_reg_dtl b ON a.id = b.id_product where b.kode_disc = ?', [id]);
            res.json(product);
        });
    }
    categories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield database_1.default.query('SELECT id FROM vh_product_category WHERE slug_url = ? LIMIT 1', [id]);
            const categories = yield database_1.default.query('select *, ' +
                'case when discounttab = "Amount" then price  - discountvalue ' +
                'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) ' +
                'end as harga_disc, ' +
                'case when discounttab = "Amount" then format(price  - discountvalue, 0) ' +
                'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) ' +
                'end as discount ' +
                'from ' +
                '(SELECT a.id, a.nic, a.color, a.name, a.stock, a.summary, a.price, a.image, a.slug_url, a.status, a.setup, format(a.price,0) as harga, b.id_parent, (SELECT image FROM vh_product_category WHERE id = ? limit 1) as imageCat, (SELECT name FROM vh_product_category WHERE id = ? limit 1) as nameCat, (SELECT if(description = "", null, description) as description FROM vh_product_category WHERE id = ? limit 1) as desCat,' +
                'case when x.discountvalue is null or x.discountvalue = "" or x.discountvalue < 1 then ifnull(a.discountvalue, 0) else ifnull(x.discountvalue, 0) end as discountvalue, ' +
                'case when x.discountvalue is null or x.discountvalue = "" or x.discountvalue < 1 then ifnull(a.discounttype, 0) else ifnull(x.discounttab, 0) end as discounttab ' +
                'FROM vh_product a ' +
                'LEFT JOIN vh_product_category b ON a.id_category = b.id ' +
                'LEFT JOIN  ' +
                '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab ' +
                'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  ' +
                'ON b.kode_disc = c.kode_disc  ' +
                'WHERE b.status = 1 GROUP BY id_product) x  ' +
                'ON a.id = x.id_product ' +
                'WHERE a.id_category = ? OR b.id_parent = ? )z WHERE z.status = 1 ORDER BY stock DESC', [category[0].id, category[0].id, category[0].id, category[0].id, category[0].id]);
            res.json(categories);
        });
    }
    ListPro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, setup FROM vh_product WHERE status = 1');
            res.json(product);
        });
    }
    ImageVariant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id, image FROM vh_product ' +
                'UNION ' +
                'SELECT id_product, image FROM vh_product_image');
            // console.log(product);
            res.json(product);
        });
    }
    Homenew(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('select *, '+
            'case when discounttab = "Amount" then price  - discountvalue '+
            'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
            'end as harga_disc, '+
            'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
            'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
            'end as discount '+
            'from '+
            '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, kondisi, setup, '+
            'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, '+
            'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab, '+
            '(SELECT COUNT(id) FROM (SELECT id,  '+
            'case when DATEDIFF( CURDATE(),create_at) between 0 and 7 then "New" else kondisi end as flag '+
            'FROM vh_product)y WHERE flag = "New") as lenght '+
            'FROM '+
            '(SELECT *, '+
            'case when DATEDIFF( CURDATE(),create_at) between 0 and 7 then "New" else kondisi end as flag '+
            'FROM vh_product WHERE status = 1)x '+
            'LEFT JOIN  '+
            '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab '+
            'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
            'ON b.kode_disc = c.kode_disc  '+
            'WHERE b.status = 1 GROUP BY id_product) y  '+
            'ON x.id = y.id_product '+
            'WHERE flag = "New" ) z ORDER BY stock DESC');
            res.json(product);
        });
    }
    Homebest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('select *, ' +
                'case when discounttab = "Amount" then price  - discountvalue ' +
                'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) ' +
                'end as harga_disc, ' +
                'case when discounttab = "Amount" then format(price  - discountvalue, 0) ' +
                'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) ' +
                'end as discount ' +
                'from ' +
                '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, setup, ' +
                'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, ' +
                'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab, ' +
                '(SELECT COUNT(id) FROM vh_product WHERE kondisi = "BestSeller" AND status = 1) as lenght ' +
                'FROM ' +
                '(SELECT * ' +
                'FROM vh_product WHERE kondisi = "BestSeller" AND status = 1)x ' +
                'LEFT JOIN  ' +
                '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab ' +
                'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  ' +
                'ON b.kode_disc = c.kode_disc  ' +
                'WHERE b.status = 1 GROUP BY id_product) y  ' +
                'ON x.id = y.id_product ) z ORDER BY stock DESC');
            res.json(product);
        });
    }
    BestProd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('select *, ' +
                'case when discounttab = "Amount" then price  - discountvalue ' +
                'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) ' +
                'end as harga_disc, ' +
                'case when discounttab = "Amount" then format(price  - discountvalue, 0) ' +
                'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) ' +
                'end as discount ' +
                'from ' +
                '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, setup, ' +
                'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, ' +
                'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab, ' +
                '(SELECT COUNT(id) FROM vh_product WHERE kondisi = "BestSeller" AND status = 1) as lenght ' +
                'FROM ' +
                '(SELECT * ' +
                'FROM vh_product WHERE kondisi = "BestSeller" AND status = 1)x ' +
                'LEFT JOIN  ' +
                '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab ' +
                'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  ' +
                'ON b.kode_disc = c.kode_disc  ' +
                'WHERE b.status = 1 GROUP BY id_product) y  ' +
                'ON x.id = y.id_product ' +
                'ORDER BY stock DESC LIMIT 0, 3) z');
            res.json(product);
        });
    }
    Homefeat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('select a.id_product as id,  b.nic, b.color, b.slug_url as slug, b.name, b.stock, b.image, b.setup, b.price, format(b.price,0) as harga, a.discountvalue, a.discounttab, ' +
                'case when a.discounttab = "Amount" then b.price  - a.discountvalue ' +
                'when a.discounttab = "Percent" then b.price - (b.price * (a.discountvalue * 0.01)) ' +
                'end as harga_disc, ' +
                'case when a.discounttab = "Amount" then format(b.price  - a.discountvalue, 0) ' +
                'when a.discounttab = "Percent" then format(b.price - (b.price * (a.discountvalue * 0.01)), 0) ' +
                'end as discount, ' +
                '(select count(id) from vh_discount_reg_dtl ' +
                'where kode_disc in (select kode_disc from vh_discount_reg_hdr where status = 1)) as lenght ' +
                'from vh_discount_reg_dtl a left join vh_product b ' +
                'on a.id_product = b.id ' +
                'where kode_disc in (select kode_disc from vh_discount_reg_hdr where status = 1)');
            res.json(product);
        });
    }
    Imagelist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT * FROM vh_product_image WHERE id_product = ?', [id]);
            res.json(product);
        });
    }
    detailProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT a.id, a.name, a.summary, a.description, a.stock, a.price, format(a.price, 0) as harga, a.image, a.width, a.height, a.depth, a.weight, a.video, a.id_category, a.setup, b.name as catName FROM vh_product a LEFT JOIN vh_product_category b ON a.id_category = b.id WHERE a.id = ? LIMIT 1', [id]);
            if (product.length > 0) {
                return res.json(product[0]);
            }
            res.status(404).json({ text: "Product doesn't exists " });
        });
    }
    detailProductSlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('select *, '+
            'case when discounttab = "Amount" then price  - discountvalue '+
            'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) '+
            'end as harga_disc, '+
            'case when discounttab = "Amount" then format(price  - discountvalue, 0) '+
            'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) '+
            'end as discount '+
            'from '+
            '( SELECT id, barcode, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, x.setup, x.status, strip_tags(replace(replace(x.description, "\n", " "), "\r", "")) as descr, if(x.description is null or x.description = "", x.summary, x.description) as description, x.width, x.height, x.depth, x.weight, x.video, x.cSlug as id_category, x.catName, '+
            'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, '+
            'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab '+
            'FROM '+
            '(SELECT a.*, d.slug_url as cSlug, d.name as catName '+
            'FROM vh_product a '+
            'LEFT JOIN vh_product_category d  '+
            'ON a.id_category = d.id '+
            'WHERE status = 1)x '+
            'LEFT JOIN  '+
            '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab  '+
            'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  '+
            'ON b.kode_disc = c.kode_disc  '+
            'WHERE b.status = 1 GROUP BY id_product) y  '+
            'ON x.id = y.id_product '+
            'WHERE x.slug_url = ? LIMIT 1) z', [id]);

                res.json(product[0]);

        });
    }
    getVariantImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(id);
            const product = yield database_1.default.query('SELECT image FROM vh_product WHERE id = ? ' +
                'UNION ' +
                'SELECT image FROM vh_product_image WHERE id_product = ?', [id, id]);
            // console.log(product);
            res.json(product);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT a.*, b.name as Bname FROM vh_product a '+
            'LEFT JOIN vh_product_brand b '+
            'ON a.id_brand = b.id '+
            'WHERE a.id = ? LIMIT 1', [id]);
            if (product.length > 0) {
                return res.json(product[0]);
            }
            res.status(404).json({ text: "Product doesn't exists " });
        });
    }
    detailprod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const  id  = req.body.bcode;
            const post = JSON.parse(req.body.data);
            console.log(post);
            const product = yield database_1.default.query('SELECT description FROM vh_product '+
            'WHERE barcode = ? LIMIT 1', post.bcode);
            console.log(product);
            if (product.length > 0) {
                res.json(product[0]);
            } else {
                res.status(404).json({ text: "Product doesn't exists " });
            }
            
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('select *, ' +
                'case when discounttab = "Amount" then price  - discountvalue ' +
                'when discounttab = "Percent" then price - (price * (discountvalue * 0.01)) ' +
                'end as harga_disc, ' +
                'case when discounttab = "Amount" then format(price  - discountvalue, 0) ' +
                'when discounttab = "Percent" then format(price - (price * (discountvalue * 0.01)), 0) ' +
                'end as discount ' +
                'from ' +
                '( SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, setup, ' +
                'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull (x.discountvalue, 0) else ifnull(y.discountvalue, 0) end as discountvalue, ' +
                'case when y.discountvalue is null or y.discountvalue = "" or y.discountvalue < 1 then ifnull(x.discounttype, 0) else ifnull(y.discounttab, 0) end as discounttab ' +
                'FROM ' +
                '(SELECT * FROM vh_product)x ' +
                'LEFT JOIN  ' +
                '(SELECT b.from_date, b.to_date, b.status, c.id_product, c.discountvalue, c.discounttab   ' +
                'FROM vh_discount_reg_hdr b LEFT JOIN vh_discount_reg_dtl c  ' +
                'ON b.kode_disc = c.kode_disc  ' +
                'WHERE b.status = 1 GROUP BY id_product) y  ' +
                'ON x.id = y.id_product ' +
                'WHERE x.status = 1 AND x.name LIKE ?) z', '%' + [id] + '%');
            return res.json(product);
        });
    }
    getLastIDProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
            res.json(product[0]);
        });
    }
    setCover(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cover = yield database_1.default.query('SELECT id_product, image FROM vh_product_cover WHERE id_product = ?', [id]);
            res.json(cover[0]);
        });
    }
    generateBarode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const generate = yield database_1.default.query('SELECT MAX(number) as no FROM vh_numbersequence WHERE kode = "MP" AND year = year(curdate()) LIMIT 1');
            res.json(generate[0]);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO vh_product set ?', [req.body]);
            res.json({ message: 'Success' });
        });
    }
    setCoverDB(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                id_product : id,
                image: req.body.image
            }
            // console.log(data);
            database_1.default.query('INSERT INTO vh_product_cover SET ? ', [data]);
            res.json({message : 'success'});
        });
    }
    delImageDB(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product_image WHERE id_product = ? AND image = ? LIMIT 1', [id, req.body.image]);
            yield database_1.default.query('DELETE FROM vh_product_image WHERE id_product = ? AND image = ?', [id, req.body.image]);
            if (product == "") {
                res.json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_product SET status = 2 WHERE id = ?', [id]);
            if (product == "") {
                res.status(404).json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    deleteImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const image = yield database_1.default.query('SELECT id FROM vh_product_image WHERE id = ?', [id]);
            yield database_1.default.query('DELETE FROM vh_product_image WHERE id = ?', [id]);
            if (image == "") {
                res.status(404).json({ text: "Product image doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    delCover(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id_product FROM vh_product_cover WHERE id_product = ? AND barcode is null', [id]);
            yield database_1.default.query('DELETE FROM vh_product_cover WHERE id_product = ? AND barcode is null', [id]);
            if (product == "") {
                res.json({ text: "Cover doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    setUPCoverDB(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(req.body);
            yield database_1.default.query('UPDATE vh_product_cover SET image = ? WHERE id_product = ?', [req.body.newimage.image, id]);
            yield database_1.default.query('call updateCover()');
            res.json({ text: 'Success' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
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
            };
            yield database_1.default.query('UPDATE vh_product SET barcode = ?, name = ?, id_category = ?, id_brand = ?, summary = ?, description = ?, stock = ?, price = ?,	color = ?, status = ?, kondisi = ?, width = ?, height = ?, depth = ?, weight = ?, home = ?, video = ?, slug_url = replace(?, " ", "-") WHERE id = ?', [data.barcode, data.name, data.id_category, data.id_brand, data.summary, data.description, data.stock, data.price, data.color, data.status, data.kondisi, data.width, data.height, data.depth, data.weight, data.home, data.video, data.slug_url, id]);
            if (product == "") {
                res.status(404).json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ message: 'The Product was Update' });
            }
        });
    }
    updateCondition(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
            const post = req.body;
            const data = {
                kondisi: post.kondisi,
            };
            yield database_1.default.query('UPDATE vh_product SET kondisi = ? WHERE id = ?', [data.kondisi, id]);
            if (product == "") {
                res.status(404).json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ message: 'The Product was Update' });
            }
        });
    }
    updateDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
            const post = req.body;
            const data = {
                discountvalue: post.dv,
                discounttype: post.flg
            };
            yield database_1.default.query('UPDATE vh_product SET discountvalue = ?, discounttype = ? WHERE id = ?', [data.discountvalue, data.discounttype, id]);
            if (product == "") {
                res.status(404).json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ message: 'The Product was Update' });
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
            const post = req.body;
            const data = {
                status: post.st,
            };
            yield database_1.default.query('UPDATE vh_product SET status = ? WHERE id = ?', [data.status, id]);
            if (product == "") {
                res.status(404).json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ message: 'The Product was Update' });
            }
        });
    }
    updateHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
            const post = req.body;
            const data = {
                home: post.hm,
            };
            yield database_1.default.query('UPDATE vh_product SET home = ? WHERE id = ?', [data.home, id]);
            if (product == "") {
                res.status(404).json({ text: "Product doesn't exists" });
            }
            else {
                res.json({ message: 'The Product was Update' });
            }
        });
    }
    updateProdCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const data = {
		setup: post.stat
	    }
	    // console.log(req.body);
            const product = yield database_1.default.query('UPDATE vh_product SET setup = ?', [data.setup]);
            if (product == "") {
           	 res.status(404).json({ text: "error" });
            } else {
                res.json({ message: 'The Product was Update' });
            }
        });
    }
}
const productcontroller = new ProductController();
exports.default = productcontroller;
