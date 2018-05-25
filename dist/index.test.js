"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
require("chai/register-should");
chai.use(chaiAsPromised);
const index_1 = require("./index");
ava_1.test("uses the demo domain when isDemo", () => __awaiter(this, void 0, void 0, function* () {
    const client = new index_1.default({ key: "key", secret: "secret", isDemo: true });
    client.baseUrl.should.equal("https://demo-api.hitbtc.com/api/v2");
}));
ava_1.test("uses the production domain when not isDemo", () => __awaiter(this, void 0, void 0, function* () {
    const client = new index_1.default({ key: "key", secret: "secret", isDemo: false });
    client.baseUrl.should.equal("https://api.hitbtc.com/api/v2");
}));
ava_1.test("uses the passed baseUrl when provided", () => __awaiter(this, void 0, void 0, function* () {
    const client = new index_1.default({ key: "key", secret: "secret", baseUrl: "http://localhost:4499/hitbtc/api" });
    client.baseUrl.should.equal("http://localhost:4499/hitbtc/api");
}));
//# sourceMappingURL=index.test.js.map