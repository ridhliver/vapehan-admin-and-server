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
let DeleteEntityDialogComponent = class DeleteEntityDialogComponent {
    /**
     * Component constructor
     *
     * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
     * @param data: any
     */
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        // Public properties
        this.viewLoading = false;
    }
    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */
    /**
     * On init
     */
    ngOnInit() {
    }
    /**
     * Close dialog with false result
     */
    onNoClick() {
        this.dialogRef.close();
    }
    /**
     * Close dialog with true result
     */
    onYesClick() {
        /* Server loading imitation. Remove this */
        this.viewLoading = true;
        setTimeout(() => {
            this.dialogRef.close(true); // Keep only this row
        }, 2500);
    }
};
DeleteEntityDialogComponent = __decorate([
    core_1.Component({
        selector: 'kt-delete-entity-dialog',
        templateUrl: './delete-entity-dialog.component.html'
    }),
    __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
], DeleteEntityDialogComponent);
exports.DeleteEntityDialogComponent = DeleteEntityDialogComponent;
