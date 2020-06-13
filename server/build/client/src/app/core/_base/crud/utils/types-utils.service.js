"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Angular */
const core_1 = require("@angular/core");
let TypesUtilsService = class TypesUtilsService {
    /**
     * Convert number to string and addinng '0' before
     *
     * @param value: number
     */
    padNumber(value) {
        if (this.isNumber(value)) {
            return `0${value}`.slice(-2);
        }
        else {
            return '';
        }
    }
    /**
     * Checking value type equals to Number
     *
     * @param value: any
     */
    isNumber(value) {
        return !isNaN(this.toInteger(value));
    }
    /**
     * Covert value to number
     *
     * @param value: any
     */
    toInteger(value) {
        return parseInt(`${value}`, 10);
    }
    /**
     * Convert date to string with 'MM/dd/yyyy' format
     *
     * @param date: Date
     */
    dateFormat(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        if (date) {
            return `${month}/${day}/${year}`;
        }
        return '';
    }
    /**
     * Convert Date to string with custom format 'MM/dd/yyyy'
     *
     * @param date: any
     */
    dateCustomFormat(date) {
        let stringDate = '';
        if (date) {
            stringDate += this.isNumber(date.month) ? this.padNumber(date.month) + '/' : '';
            stringDate += this.isNumber(date.day) ? this.padNumber(date.day) + '/' : '';
            stringDate += date.year;
        }
        return stringDate;
    }
    /**
     * Convert string to DateFormatter (For Reactive Forms Validators)
     *
     * @param dateInStr: string (format => 'MM/dd/yyyy')
     */
    getDateFormatterFromString(dateInStr) {
        if (dateInStr && dateInStr.length > 0) {
            const dateParts = dateInStr.trim().split('/');
            return [
                {
                    year: this.toInteger(dateParts[2]),
                    month: this.toInteger(dateParts[0]),
                    day: this.toInteger(dateParts[1])
                }
            ];
        }
        const _date = new Date();
        return [
            {
                year: _date.getFullYear(),
                month: _date.getMonth() + 1,
                day: _date.getDay()
            }
        ];
    }
    /**
     * Convert string to Date
     *
     * @param dateInStr: string (format => 'MM/dd/yyyy')
     */
    getDateFromString(dateInStr = '') {
        if (dateInStr && dateInStr.length > 0) {
            const dateParts = dateInStr.trim().split('/');
            const year = this.toInteger(dateParts[2]);
            const month = this.toInteger(dateParts[0]);
            const day = this.toInteger(dateParts[1]);
            // tslint:disable-next-line:prefer-const
            let result = new Date();
            result.setDate(day);
            result.setMonth(month - 1);
            result.setFullYear(year);
            return result;
        }
        return new Date();
    }
    /**
     * Convert Date to string with format 'MM/dd/yyyy'
     * @param _date: Date?
     */
    getDateStringFromDate(_date = new Date()) {
        const month = _date.getMonth() + 1;
        const year = _date.getFullYear();
        const date = _date.getDate();
        return `${month}/${date}/${year}`;
    }
};
TypesUtilsService = __decorate([
    core_1.Injectable()
], TypesUtilsService);
exports.TypesUtilsService = TypesUtilsService;
