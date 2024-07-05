"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinuetServerModuleAuthoricate = exports.MinuetAuthoricate = void 0;
const minuet_server_1 = require("minuet-server");
class MinuetAuthoricate {
    constructor(authoricates) {
        this.authoricates = authoricates;
    }
    listen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = req.url.split("?")[0];
            const c = Object.keys(this.authoricates);
            let decisionAuthoricate;
            for (let n = 0; n < c.length; n++) {
                const targetUrl = c[n];
                const authoricate = this.authoricates[targetUrl];
                if ((url + "/").indexOf(targetUrl + "/") === 0) {
                    decisionAuthoricate = authoricate;
                    break;
                }
            }
            if (!decisionAuthoricate)
                return false;
            const encodedCredentials = Buffer.from(decisionAuthoricate.user + ":" + decisionAuthoricate.pass).toString('base64');
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Basic ')) {
                const credentials = authHeader.split(' ')[1];
                if (credentials === encodedCredentials) {
                    return false;
                }
            }
            res.statusCode = 401;
            res.setHeader("WWW-Authenticate", "Basic realm=\"Authoricate\"");
            if (!decisionAuthoricate.failureMessage)
                decisionAuthoricate.failureMessage = "Authentication failure";
            res.write(decisionAuthoricate.failureMessage);
            res.end();
            return true;
        });
    }
}
exports.MinuetAuthoricate = MinuetAuthoricate;
class MinuetServerModuleAuthoricate extends minuet_server_1.MinuetServerModuleBase {
    onBegin() {
        this.authoricate = new MinuetAuthoricate();
    }
    onListen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authoricate.listen(req, res);
        });
    }
}
exports.MinuetServerModuleAuthoricate = MinuetServerModuleAuthoricate;
