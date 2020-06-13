"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Angular
const core_1 = require("@angular/core");
const material_1 = require("@angular/material");
// RxJS
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
let ActionNotificationComponent = class ActionNotificationComponent {
    /**
     * Component constructor
     *
     * @param data: any
     */
    constructor(data) {
        this.data = data;
    }
    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */
    /**
     * On init
     */
    ngOnInit() {
        if (!this.data.showUndoButton || (this.data.undoButtonDuration >= this.data.duration)) {
            return;
        }
        this.delayForUndoButton(this.data.undoButtonDuration).subscribe(() => {
            this.data.showUndoButton = false;
        });
    }
    /*
     *	Returns delay
     *
     * @param timeToDelay: any
     */
    delayForUndoButton(timeToDelay) {
        return rxjs_1.of('').pipe(operators_1.delay(timeToDelay));
    }
    /**
     * Dismiss with Action
     */
    onDismissWithAction() {
        this.data.snackBar.dismiss();
    }
    /**
     * Dismiss
     */
    onDismiss() {
        this.data.snackBar.dismiss();
    }
};
ActionNotificationComponent = __decorate([
    core_1.Component({
        selector: 'kt-action-natification',
        templateUrl: './action-notification.component.html',
        changeDetection: core_1.ChangeDetectionStrategy.Default
    }),
    __param(0, core_1.Inject(material_1.MAT_SNACK_BAR_DATA))
], ActionNotificationComponent);
exports.ActionNotificationComponent = ActionNotificationComponent;
