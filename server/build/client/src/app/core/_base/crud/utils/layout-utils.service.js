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
// Partials for CRUD
const crud_1 = require("../../../../views/partials/content/crud");
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Create"] = 0] = "Create";
    MessageType[MessageType["Read"] = 1] = "Read";
    MessageType[MessageType["Update"] = 2] = "Update";
    MessageType[MessageType["Delete"] = 3] = "Delete";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
let LayoutUtilsService = class LayoutUtilsService {
    /**
     * Service constructor
     *
     * @param snackBar: MatSnackBar
     * @param dialog: MatDialog
     */
    constructor(snackBar, dialog) {
        this.snackBar = snackBar;
        this.dialog = dialog;
    }
    /**
     * Showing (Mat-Snackbar) Notification
     *
     * @param message: string
     * @param type: MessageType
     * @param duration: number
     * @param showCloseButton: boolean
     * @param showUndoButton: boolean
     * @param undoButtonDuration: number
     * @param verticalPosition: 'top' | 'bottom' = 'top'
     */
    showActionNotification(_message, _type = MessageType.Create, _duration = 10000, _showCloseButton = true, _showUndoButton = false, 
    // _undoButtonDuration: number = 3000,
    _verticalPosition = 'bottom') {
        const _data = {
            message: _message,
            snackBar: this.snackBar,
            showCloseButton: _showCloseButton,
            // showUndoButton: _showUndoButton,
            // undoButtonDuration: _undoButtonDuration,
            verticalPosition: _verticalPosition,
            type: _type,
        };
        return this.snackBar.openFromComponent(crud_1.ActionNotificationComponent, {
            duration: _duration,
            data: _data,
            verticalPosition: _verticalPosition
        });
    }
    /**
     * Showing Confirmation (Mat-Dialog) before Entity Removing
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */
    deleteElement(title = '', description = '', waitDesciption = '') {
        return this.dialog.open(crud_1.DeleteEntityDialogComponent, {
            data: { title, description, waitDesciption },
            width: '440px'
        });
    }
    /**
     * Showing Add Discount Product (Mat-Dialog) before Entity Add
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */
    addingElement(title = '', description = '', waitDesciption = '') {
        return this.dialog.open(crud_1.AddDiscountDialogComponent, {
            data: { title, description, waitDesciption },
            width: '440px'
        });
    }
    /**
     * Showing Confirmation (Mat-Dialog) before Entity Create
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */
    CreteResiElement(title = '', description = '', waitDesciption = '', data) {
        return this.dialog.open(crud_1.CreateResiDialogComponent, {
            data: { title, description, waitDesciption, data },
            width: '440px'
        });
    }
    /**
     * Showing Message (Mat-Dialog)
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */
    MessageElement(title = '', description = '', waitDesciption = '') {
        return this.dialog.open(crud_1.MessageEntityDialogComponent, {
            data: { title, description, waitDesciption },
            width: '440px'
        });
    }
    /**
     * Change No HP (Mat-Dialog)
     *
     * @param title: stirng
     * @param description: stirng
     * @param waitDesciption: string
     */
    ChangeElement(title = '', description = '', waitDesciption = '', data) {
        return this.dialog.open(crud_1.ChangeHPDialogComponent, {
            data: { title, description, waitDesciption, data },
            width: '440px'
        });
    }
    /**
     * Showing Fetching Window(Mat-Dialog)
     *
     * @param _data: any
     */
    fetchElements(_data) {
        return this.dialog.open(crud_1.FetchEntityDialogComponent, {
            data: _data,
            width: '400px'
        });
    }
    /**
     * Showing Update Status for Entites Window
     *
     * @param title: string
     * @param statuses: string[]
     * @param messages: string[]
     */
    updateStatusForEntities(title, statuses, messages) {
        return this.dialog.open(crud_1.UpdateStatusDialogComponent, {
            data: { title, statuses, messages },
            width: '480px'
        });
    }
};
LayoutUtilsService = __decorate([
    core_1.Injectable()
], LayoutUtilsService);
exports.LayoutUtilsService = LayoutUtilsService;
