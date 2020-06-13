"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesController_1 = __importDefault(require("../../../controllers/auth/roles/rolesController"));
class RolesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
		this.router.get('/', rolesController_1.default.list);
		this.router.get('/roles', rolesController_1.default.roleslist);
        this.router.get('/permission', rolesController_1.default.listing);
        this.router.get('/title', rolesController_1.default.title);
        this.router.get('/getId/:id', rolesController_1.default.getId);
        this.router.get('/:id', rolesController_1.default.detail);
        this.router.post('/', rolesController_1.default.create);
        this.router.delete('/:id', rolesController_1.default.delete);
        this.router.put('/:id', rolesController_1.default.update);
    }
}
const rolesRoutes = new RolesRoutes();
exports.default = rolesRoutes.router;
