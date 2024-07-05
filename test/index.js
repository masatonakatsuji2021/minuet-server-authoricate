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
const minuet_server_authoricate_1 = require("minuet-server-authoricate");
const http = require("http");
const ma = new minuet_server_authoricate_1.MinuetAuthoricate({
    "/auth_area": {
        user: "test",
        pass: "1234",
    },
});
http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield ma.listen(req, res);
    if (status)
        return;
    res.write(".....Hallo!");
    res.end();
})).listen(8829);
console.log("listen http://localhost:8829");
