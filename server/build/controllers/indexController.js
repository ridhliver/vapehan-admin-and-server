"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexController {
    index(req, res) {
        console.log(req.body);
    }
}
exports.indexController = new IndexController();

