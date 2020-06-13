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
class RolesController {
    listing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT vh_user_roles_admin.id, title, vh_roles_permission.id_permissions as permissions, vh_user_roles_admin.isCoreRole FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles');
            // const id = roles.id;
            // console.log(roles);
            return res.json(roles);
        });
    }
    /*
    public async list(req: Request, res: Response) {
        const roles = await pool.query('SELECT vh_user_roles_admin.id, title, vh_roles_permission.id_permissions as permissions, vh_user_roles_admin.isCoreRole FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles');
        //const id = roles.id;
        // console.log(id);
        return res.json(roles);

        res.json(roles.map(function(result: any) {
            if (result.isCoreRole === 1) {
                result.isCoreRole = true
            } else {
                result.isCoreRole = false
            }
            let _per = [];
            _per.push(result.permissions);
            let obj = {
                id: result.id,
                title: result.title,
                isCoreRole: result.isCoreRole,
                permissions: _per
            }

            return obj;
        }));
    }
    */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT * FROM vh_user_roles_admin');
            const id = roles.id;
            // console.log(id);
            return res.json(roles);
        });
	}
	roleslist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT * FROM vh_user_roles_admin WHERE id != 1');
            const id = roles.id;
            // console.log(id);
            return res.json(roles);
        });
    }
    title(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = yield database_1.default.query('SELECT vh_user_roles_admin.* FROM vh_user_roles_admin JOIN vh_user_admin ON vh_user_roles_admin.id = vh_user_admin.roles');
            return res.json(title);
        });
    }
    getId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const roles = yield database_1.default.query('SELECT vh_user_roles_admin.*, vh_roles_permission.id_permissions as permissions FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles WHERE vh_user_roles_admin.id = ?', [id]);
            /*
            res.json(roles.reduce(function(result: any, current: any) {
                let obj = {};
                obj = current.permissions;
                current.permissions|| [];
                // obj[current.title] = current.isCoreRole;
                result[current.permissions].push(obj);

                return result;

            }));
            */
            if (roles.length > 0) {
                return res.json(roles[0]);
            }
            res.status(404).json({ text: "Roles doesn't exists" });
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const roles = yield database_1.default.query('SELECT * FROM vh_user_roles_admin WHERE id = ?', [id]);
            if (roles.length > 0) {
                return res.json(roles[0]);
            }
            res.status(404).json({ text: "Roles doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const title = post.title;
            const isCoreRole = post.isCoreRole;
            let sql = "INSERT INTO vh_user_roles_admin (title, isCoreRole) VALUES ('" + title + "', '" + isCoreRole + "')";
            yield database_1.default.query(sql, function (err, result) {
                if (err)
                    throw err;
                for (let i = 0; i < post.permissions.length; i++) {
                    let id_roles = [result.insertId];
                    const permissions = {
                        id_roles: id_roles,
                        id_permissions: post.permissions[i]
                    };
                    console.log(permissions);
                    database_1.default.query('INSERT INTO vh_roles_permission SET ?', permissions);
                }
            });
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const roles = yield database_1.default.query('SELECT id FROM vh_user_roles_admin WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE vh_user_roles_admin.*, vh_roles_permission.* FROM vh_user_roles_admin JOIN vh_roles_permission ON vh_user_roles_admin.id = vh_roles_permission.id_roles WHERE vh_user_roles_admin.id = ?', [id]);
            if (roles == "") {
                res.status(404).json({ text: "Roles doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const roles = yield database_1.default.query('SELECT id FROM vh_user_roles_admin WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_user_roles_admin set ? WHERE id = ?', [req.body, id]);
            if (roles == "") {
                res.status(404).json({ text: "Roles doesn't exists" });
            }
            else {
                res.json({ message: 'The Roles was Update' });
            }
        });
    }
}
const rolescontroller = new RolesController();
exports.default = rolescontroller;
