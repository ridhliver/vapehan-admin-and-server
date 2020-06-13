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
const md5_1 = __importDefault(require("md5"));
class UserController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.default.query('SELECT vh_user_admin.*, vh_user_roles_admin.title as title FROM vh_user_admin, vh_user_roles_admin WHERE vh_user_roles_admin.id = vh_user_admin.roles');
            return res.json(user);
            /*
             res.json(user.map(function(result: any,current: any) {
                let obj =
                    {
                        id: result.id,
                        username: result.username,
                        password: '',
                        email: result.email,
                        roles: [result.roles],
                        fullname: result.fullname,
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken,
                        pic: result.pic,
                        occupation: result.occupation,
                        companyName: result.companyName,
                        phone: result.phone,
                        address: result.address,
                        status: result.status,
                        title: result.title
                    }
                
                return obj;
            }));
            */
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT * FROM vh_user_admin WHERE id = ?', [id]);
            if (user.length > 0) {
                return res.json(user[0]);
            }
            res.status(404).json({ text: "User doesn't exists" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = req.body;
            const user = {
                username: post.username,
                password: md5_1.default(post.password),
                email: post.email,
                roles: '3',
                fullname: post.fullname,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                pic: 'default.jpg',
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                address: '',
                status: 0
            };
            yield database_1.default.query('INSERT INTO vh_user_admin set ? ', [user]);
            res.json({ message: 'Success' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield database_1.default.query('SELECT id FROM vh_user_admin WHERE id = ? ', [id]);
            yield database_1.default.query('DELETE FROM vh_user_admin WHERE id = ?', [id]);
            if (user == "") {
                res.status(404).json({ text: "User doesn't exists" });
            }
            else {
                res.json({ text: 'Success Delete' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const post = req.body;
            const _user = {
                username: post.username,
                password: md5_1.default(post.password),
                email: post.email,
                roles: post.roles,
                fullname: post.fullname,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                address: post.address.addressLine
            };
            const user = yield database_1.default.query('SELECT id FROM vh_user_admin WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_user_admin set ? WHERE id = ?', [_user, id]);
            if (user == "") {
                res.status(404).json({ text: "User doesn't exists" });
            }
            else {
                res.json({ message: 'The User was Update' });
            }
        });
    }
    password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const post = req.body;
            const _user = {
                username: post.username,
                password: md5_1.default(post.password),
                email: post.email,
                fullname: post.fullname,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
            };
            const user = yield database_1.default.query('SELECT id FROM vh_user_admin WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_user_admin set ? WHERE id = ?', [_user, id]);
            if (user == "") {
                res.status(404).json({ text: "User doesn't exists" });
            }
            else {
                res.json({ message: 'The User was Update' });
            }
        });
    }
    status(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const post = req.body;
            const _user = {
                username: post.username,
                password: md5_1.default(post.password),
                email: post.email,
                fullname: post.fullname,
                accessToken: post.accessToken,
                refreshToken: post.refreshToken,
                occupation: post.occupation,
                companyName: post.companyName,
                phone: post.phone,
                status: post.status
            };
            const user = yield database_1.default.query('SELECT id FROM vh_user_admin WHERE id = ?', [id]);
            yield database_1.default.query('UPDATE vh_user_admin set ? WHERE id = ?', [_user, id]);
            if (user == "") {
                res.status(404).json({ text: "User doesn't exists" });
            }
            else {
                res.json({ message: 'The User was Update' });
            }
        });
    }
}
const usercontroller = new UserController();
exports.default = usercontroller;
