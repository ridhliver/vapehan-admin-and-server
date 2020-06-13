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
class NotifController {
    orderlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const notif = yield database_1.default.query('SELECT COUNT(id_order) as notif FROM vh_order WHERE status = 0');
            res.json(notif[0]);
        });
    }
    confirmlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const notif = yield database_1.default.query('SELECT COUNT(transaction_id) as notif FROM vh_confirm_order WHERE status = 0');
            res.json(notif[0]);
        });
    }
}
const notifcontroller = new NotifController();
exports.default = notifcontroller;
