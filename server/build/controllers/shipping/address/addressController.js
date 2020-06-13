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
class AddressController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const address = yield database_1.default.query('SELECT * FROM vh_address WHERE district = ?', [id]);
            // console.log(address);
            res.json(address);
        });
    }
    provinces(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const provinces = yield database_1.default.query('SELECT * FROM vh_province');
	        res.json(provinces);
	    });
    }
    provinces_dtl(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const provinces = yield database_1.default.query('SELECT * FROM vh_province WHERE province_id = ?', [id]);
	        res.json(provinces);
	    });
    }
    cities(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const cities = yield database_1.default.query('SELECT * FROM vh_city');
            res.json(cities);
	    });
    }
    districts(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const district = yield database_1.default.query('SELECT * FROM vh_subdistrict');
            // console.log(district);
            res.json(district);
	    });
    }
    saveProv(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body);
            const province = yield database_1.default.query('SELECT * FROM vh_province WHERE province_id = ?', [req.body.provi_id]);
            if (province) {
                const data = {
                    province_id: req.body.provi_id,
                    province: req.body.provi
                };
                //console.log(data);
                database_1.default.query('UPDATE vh_province SET ? WHERE province_id = ?', [data, data.province_id]);
            }
            if (province == "") {
                const data = {
                    province_id: req.body.provi_id,
                    province: req.body.provi
                };
                //console.log(data);
                database_1.default.query('INSERT INTO vh_province SET ?', [data]);
            }
	        res.json({ message: 'Success' });
	    });
    }
    saveCity(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const city = yield database_1.default.query('SELECT * FROM vh_city WHERE city_id = ?', [req.body.cit_id]);
            if (city) {
                const data = {
                    city_id: req.body.cit_id,
                    city_name: req.body.cit_name,
                    type: req.body.type,
                    postal_code: req.body.pos,
                    province_id: req.body.provi_id,
                    province: req.body.provi
                };
                //console.log(data);
                database_1.default.query('UPDATE vh_city SET ? WHERE city_id = ?', [data, data.city_id]);
            }
            if (city == "") {
                const data = {
                    city_id: req.body.cit_id,
                    city_name: req.body.cit_name,
                    type: req.body.type,
                    postal_code: req.body.pos,
                    province_id: req.body.provi_id,
                    province: req.body.provi
                };
                //console.log(data);
                database_1.default.query('INSERT INTO vh_city SET ?', [data]);
            }
	        res.json({ message: 'Success' });
	    });
    }
    saveDist(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const city = yield database_1.default.query('SELECT * FROM vh_subdistrict WHERE subdistrict_id = ?', [req.body.dist_id]);
            if (city) {
                const data = {
                    subdistrict_id: req.body.dist_id,
                    province_id: req.body.provi_id,
                    province: req.body.provi,
                    city_id: req.body.cit_id,
                    city: req.body.cit,
                    type: req.body.type,
                    subdistrict_name: req.body.dist_name
                };
                //console.log(data);
                database_1.default.query('UPDATE vh_subdistrict SET ? WHERE subdistrict_id = ?', [data, data.subdistrict_id]);
            }
            if (city == "") {
                const data = {
                    subdistrict_id: req.body.dist_id,
                    province_id: req.body.provi_id,
                    province: req.body.provi,
                    city_id: req.body.cit_id,
                    city: req.body.cit,
                    type: req.body.type,
                    subdistrict_name: req.body.dist_name
                };
                //console.log(data);
                database_1.default.query('INSERT INTO vh_subdistrict SET ?', [data]);
            }
	        res.json({ message: 'Success' });
	    });
    }
    editProv(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                province_id: req.body.province_id,
                province: req.body.province
            };
            database_1.default.query('UPDATE vh_province SET ? WHERE province_id = ?', [data, id]);
	        res.json({ message: 'Success' });
	    });
    }
    editCity(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                subdistrict_id: req.body.dist_id,
                province_id: req.body.provi_id,
                province: req.body.provi,
                city_id: req.body.cit_id,
                type: req.body.type,
                subdistrict_name: req.body.dist_name
            };
            database_1.default.query('UPDATE vh_city SET ? WHERE city_id = ?', [data, id]);
	        res.json({ message: 'Success' });
	    });
    }
    editDist(req, res) {
    	return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = {
                subdistrict_id: req.body.dist_id,
                province_id: req.body.provi_id,
                province: req.body.provi,
                city_id: req.body.cit_id,
                city: req.body.cit,
                type: req.body.type,
                subdistrict_name: req.body.dist_name
            };
            database_1.default.query('UPDATE vh_subdistrict SET ? WHERE subdistrict_id = ?', [data, id]);
	        res.json({ message: 'Success' });
	    });
    }
}
const addresscontroller = new AddressController();
exports.default = addresscontroller;
