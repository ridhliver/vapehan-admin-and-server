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
class PermissionController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const permission = yield database_1.default.query('SELECT * FROM vh_permissions_auth');
            return res.json(permission);
        });
    }
    getRolePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            // console.log(id);
            const getPermission = yield database_1.default.query('SELECT vh_permissions_auth.* FROM vh_permissions_auth JOIN vh_roles_permission ON vh_permissions_auth.id = vh_roles_permission.id_permissions JOIN vh_user_roles_admin ON vh_user_roles_admin.id = vh_roles_permission.id_roles WHERE vh_user_roles_admin.id = ?', [id]);
            // const { id_per } = getPermission.id_permissions;
            // const permission = await pool.query('SELECT * FROM vh_permissions_auth WHERE id = ?' [id_per]);
            return res.json(getPermission);
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const permission = yield database_1.default.query('SELECT * FROM vh_permissions_auth WHERE id = ?', [id]);
            if (permission.length > 0) {
                return res.json(permission[0]);
            }
            res.status(404).json({ text: "Permission doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO vh_permissions_auth set ? ', [req.body]);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const permission = yield database_1.default.query('SELECT id FROM vh_permissions_auth WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_permissions_auth WHERE id = ?', [id]);
            if (permission == "") {
                res.status(404).json({ text: "Permission doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const permission = yield database_1.default.query('SELECT id FROM vh_permissions_auth WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_permissions_auth set ? WHERE id = ?', [req.body, id]);
            if (permission == "") {
                res.status(404).json({ text: "Permission doesn't exists" });
            }
            else {
                res.json({ message: 'The Permission was Update' });
            }
        });
    }
}
const permissioncontroller = new PermissionController();
exports.default = permissioncontroller;
