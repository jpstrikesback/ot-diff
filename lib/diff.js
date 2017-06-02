"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Diff = (function () {
    function Diff() {
    }
    Diff.prototype.diff = function (oldStr, newStr, raw) {
        this.newStr = newStr;
        this.oldStr = oldStr;
        this.raw = raw;
        this.changeStart = this._changeStart(oldStr, newStr);
        this.changeFromEnd = this._changeFromEnd(oldStr, newStr, this.changeStart);
        this.changeEndIndexNew = newStr.length - this.changeFromEnd;
        this.changeEndIndexOld = oldStr.length - this.changeFromEnd;
        this.charsAdded = this.changeEndIndexNew - this.changeStart;
        this.charsRemoved = this.changeEndIndexOld - this.changeStart;
        return this._payload();
    };
    Diff.prototype._changeStart = function (oldStr, newStr) {
        var start = 0;
        // Doesn't use TS/ES2015 sugar, but it's 20x faster that for..in.
        while (start < oldStr.length && start < newStr.length && oldStr[start] == newStr[start]) {
            start++;
        }
        return start;
    };
    Diff.prototype._changeFromEnd = function (oldStr, newStr, changeStart) {
        var end = 0;
        while (end < oldStr.length &&
            end < newStr.length &&
            oldStr.length - end > changeStart &&
            newStr.length - end > changeStart &&
            oldStr[oldStr.length - 1 - end] == newStr[newStr.length - 1 - end]) {
            end++;
        }
        return end;
    };
    Diff.prototype._payload = function () {
        var result;
        if (this.charsRemoved === 0 && this.charsAdded > 0) {
            result = {
                action: 'insert',
                start: this.changeStart,
                payload: this.newStr.slice(this.changeStart, this.changeEndIndexNew)
            };
        }
        else if (this.charsRemoved > 0 && this.charsAdded === 0) {
            result = {
                action: 'delete',
                start: this.changeStart,
                remove: this.charsRemoved
            };
        }
        else if (this.charsRemoved > 0 && this.charsAdded > 0) {
            result = {
                action: 'replace',
                start: this.changeStart,
                remove: this.charsRemoved,
                payload: this.newStr.substr(this.changeStart, this.charsAdded)
            };
        }
        else {
            result = {
                action: 'noop'
            };
        }
        if (this.raw) {
            result.raw = this;
        }
        return result;
    };
    return Diff;
}());
exports.Diff = Diff;
exports.OtDiff = new Diff();