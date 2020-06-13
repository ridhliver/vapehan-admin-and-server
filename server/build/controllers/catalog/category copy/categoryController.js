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
class CategoryController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield database_1.default.query('SELECT * FROM vh_product_category');
            res.json(category);
        });
    }
    categorylist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield database_1.default.query('SELECT * FROM vh_product_category WHERE id != 1');
            res.json(category);
        });
    }
    listing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield database_1.default.query('SELECT id, name, type, megaMenu, slug_url, image, id_parent FROM vh_product_category WHERE id != 1 AND id_parent = 1', { "children": {} });
            for (let i = 0; i < category.length; i++) {
                category[i].children = yield database_1.default.query('SELECT id, name, type, megaMenu, slug_url, image, id_parent FROM vh_product_category WHERE id_parent = ?', [category[i].id]);
            }
            res.json(category);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield database_1.default.query('SELECT * FROM vh_product_category WHERE id = ?', [id]);
            if (category.length > 0) {
                return res.json(category[0]);
            }
            res.status(404).json({ text: "Category doesn't exists" });
        });
    }
    detailName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield database_1.default.query('SELECT name FROM vh_product_category WHERE id = ?', [id]);
            if (category.length > 0) {
                return res.json(category[0]);
            }
            res.status(404).json({ text: "Category doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                name: req.body.name,
                id_parent: req.body.id_parent,
                description: req.body.description,
                image: req.body.iamge,
                slug_url: req.body.slug_url,
                type: 'link',
            };
            yield database_1.default.query('INSERT INTO vh_product_category set ? ', [data]);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield database_1.default.query('SELECT id FROM vh_product_category WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_product_category WHERE id = ?', [id]);
            if (category == "") {
                res.status(404).json({ text: "Category doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const category = yield database_1.default.query('SELECT id FROM vh_product_category WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_product_category set ? WHERE id = ?', [req.body, id]);
            if (category == "") {
                res.status(404).json({ text: "Category doesn't exists" });
            }
            else {
                res.json({ message: 'The Category was Update' });
            }
        });
    }
}
const categorycontroller = new CategoryController();
exports.default = categorycontroller;
