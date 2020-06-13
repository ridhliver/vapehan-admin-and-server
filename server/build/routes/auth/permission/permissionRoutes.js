"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionController_1 = __importDefault(require("../../../controllers/auth/permission/permissionController"));
class PermissionRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', permissionController_1.default.list);
        this.router.get('/getRolePermission/:id', permissionController_1.default.getRolePermission);
        this.router.get('/:id', permissionController_1.default.detail);
        this.router.post('/', permissionController_1.default.create);
        this.router.delete('/:id', permissionController_1.default.delete);
        this.router.put('/:id', permissionController_1.default.update);
    }
}
const permissionRoutes = new PermissionRoutes();
exports.default = permissionRoutes.router;
