"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Biodata {
    clear() {
        this.image = null;
        this.gender = '';
        this.phone = '';
        this.address = '';
        this.id_province = 0;
        this.id_city = 0;
        this.id_district = 0;
        this.postal = 0;
    }
}
exports.Biodata = Biodata;
