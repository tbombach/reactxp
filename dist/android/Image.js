"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Image_1 = require("../native-common/Image");
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Overwrite the style for android since native Image has a fade in animation when an image loads
    // Setting the fadeDuration to 0, removes that animation
    Image.prototype._getAdditionalProps = function () {
        return { fadeDuration: 0 };
    };
    return Image;
}(Image_1.Image));
exports.Image = Image;
exports.default = Image;
