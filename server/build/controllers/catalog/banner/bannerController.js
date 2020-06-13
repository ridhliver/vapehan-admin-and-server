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
class BannerController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const banner = yield database_1.default.query('SELECT * FROM vh_banner');
            return res.json(banner);
        });
    }
    listbanner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const banner = yield database_1.default.query('SELECT * FROM vh_banner WHERE status = 1');
            return res.json(banner);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const banner = yield database_1.default.query('SELECT * FROM vh_banner WHERE id = ?', [id]);
            if (banner.length > 0) {
                return res.json(banner[0]);
            }
            res.status(404).json({ text: "Banner doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO vh_banner set ? ', [req.body]);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const banner = yield database_1.default.query('SELECT id FROM vh_banner WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_banner WHERE id = ?', [id]);
            if (banner == "") {
                res.status(404).json({ text: "Banner doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const banner = yield database_1.default.query('SELECT id FROM vh_banner WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_banner set ? WHERE id = ?', [req.body, id]);
            if (banner == "") {
                res.status(404).json({ text: "Banner doesn't exists" });
            }
            else {
                res.json({ message: 'The Banner was Update' });
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                status: req.body.flag
            };
            console.log(data);
            const banner = yield database_1.default.query('SELECT id FROM vh_banner WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_banner set ? WHERE id = ?', [data, id]);
            if (banner == "") {
                res.status(404).json({ text: "Banner doesn't exists" });
            }
            else {
                res.json({ message: 'The Banner was Update' });
            }
        });
    }
}
const bannercontroller = new BannerController();
exports.default = bannercontroller;
