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
            const product = yield database_1.default.query('SELECT *, format(price,0) as harga FROM vh_product');
            res.json(product);
        });
    }
    plist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT a.*, format(a.price,0) as harga, b.kode_disc FROM vh_product a LEFT JOIN vh_discount_reg_dtl b ON a.id = b.id_product where (b.kode_disc is null or b.kode_disc = "") and a.status = 1');
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
            const categories = yield database_1.default.query('SELECT a.id, a.nic, a.color, a.name, a.stock, a.price, a.image, a.slug_url, format(a.price,0) as harga, b.id_parent, b.image as imageCat, b.name as nameCat ' +
                'FROM vh_product a ' +
                'LEFT JOIN vh_product_category b ON a.id_category = b.id ' +
                'WHERE a.id_category = ? OR b.id_parent = ? AND a.status = 1', [category[0].id, category[0].id]);
            res.json(categories);
        });
    }
    ListPro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga FROM vh_product WHERE status = 1');
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
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, ' +
                '(SELECT COUNT(id) FROM (SELECT id, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "New" else kondisi end as flag ' +
                'FROM vh_product)y WHERE flag = "New") as lenght ' +
                'FROM ' +
                '(SELECT *, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "New" else kondisi end as flag ' +
                'FROM vh_product)x ' +
                'WHERE flag = "New"');
            res.json(product);
        });
    }
    Homebest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, ' +
                '(SELECT COUNT(id) FROM (SELECT id, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag ' +
                'FROM vh_product)y WHERE flag = "BestSeller") as lenght ' +
                'FROM ' +
                '(SELECT *, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag ' +
                'FROM vh_product)x ' +
                'WHERE flag = "BestSeller"');
            res.json(product);
        });
    }
    BestProd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, ' +
                '(SELECT COUNT(id) FROM (SELECT id, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag ' +
                'FROM vh_product)y WHERE flag = "BestSeller") as lenght ' +
                'FROM ' +
                '(SELECT *, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "BestSeller" else kondisi end as flag ' +
                'FROM vh_product)x ' +
                'WHERE flag = "BestSeller" ORDER BY id DESC LIMIT 0, 3');
            res.json(product);
        });
    }
    Homefeat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga, ' +
                '(SELECT COUNT(id) FROM (SELECT id, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "Feature" else kondisi end as flag ' +
                'FROM vh_product)y WHERE flag = "Feature") as lenght ' +
                'FROM ' +
                '(SELECT *, ' +
                'case when DATEDIFF( CURDATE(),create_at) between 1 and 7 then "Feature" else kondisi end as flag ' +
                'FROM vh_product)x ' +
                'WHERE flag = "Feature"');
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
            const product = yield database_1.default.query('SELECT a.id, a.name, a.summary, a.description, a.stock, a.price, format(a.price, 0) as harga, a.image, a.width, a.height, a.depth, a.weight, a.video, a.id_category, b.name as catName FROM vh_product a LEFT JOIN vh_product_category b ON a.id_category = b.id WHERE a.id = ? LIMIT 1', [id]);
            if (product.length > 0) {
                return res.json(product[0]);
            }
            res.status(404).json({ text: "Product doesn't exists " });
        });
    }
    detailProductSlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT a.id, a.name, a.nic, a.color, a.summary, a.description, a.stock, a.price, format(a.price, 0) as harga, a.image, a.width, a.height, a.depth, a.weight, a.video, a.id_category, b.name as catName FROM vh_product a LEFT JOIN vh_product_category b ON a.id_category = b.id WHERE a.slug_url = ? LIMIT 1', [id]);
            if (product.length > 0) {
                return res.json(product[0]);
            }
            res.status(404).json({ text: "Product doesn't exists " });
        });
    }
    getVariantImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
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
            const product = yield database_1.default.query('SELECT * FROM vh_product WHERE id = ? LIMIT 1', [id]);
            if (product.length > 0) {
                return res.json(product[0]);
            }
            res.status(404).json({ text: "Product doesn't exists " });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id, nic, color, slug_url as slug, name, stock, image, price, format(price,0) as harga FROM vh_product WHERE status = 1 AND name LIKE ?', '%' + [id] + '%');
            if (product.length > 0) {
                return res.json(product);
            }
            res.status(404).json({ text: "Product doesn't exists " });
        });
    }
    getLastIDProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id in (SELECT MAX(id) FROM vh_product) LIMIT 1');
            res.json(product[0]);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO vh_product set ?', [req.body]);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield database_1.default.query('SELECT id FROM vh_product WHERE id = ?', [id]);
            yield database_1.default.query('DELETE FROM vh_product WHERE id = ?', [id]);
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
}
const productcontroller = new ProductController();
exports.default = productcontroller;
