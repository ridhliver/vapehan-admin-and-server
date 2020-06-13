"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Angular
const core_1 = require("@angular/core");
let AlertComponent = class AlertComponent {
    constructor() {
        this.duration = 0;
        this.showCloseButton = true;
        this.close = new core_1.EventEmitter();
        this.alertShowing = true;
    }
    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */
    /**
     * On init
     */
    ngOnInit() {
        if (this.duration === 0) {
            return;
        }
        setTimeout(() => {
            this.closeAlert();
        }, this.duration);
    }
    /**
     * close alert
     */
    closeAlert() {
        this.close.emit();
    }
};
__decorate([
    core_1.Input()
], AlertComponent.prototype, "type", void 0);
__decorate([
    core_1.Input()
], AlertComponent.prototype, "duration", void 0);
__decorate([
    core_1.Input()
], AlertComponent.prototype, "showCloseButton", void 0);
__decorate([
    core_1.Output()
], AlertComponent.prototype, "close", void 0);
AlertComponent = __decorate([
    core_1.Component({
        selector: 'kt-alert',
        templateUrl: './alert.component.html'
    })
], AlertComponent);
exports.AlertComponent = AlertComponent;
