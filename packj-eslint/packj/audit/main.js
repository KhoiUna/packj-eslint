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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../config.js");
function auditPackage(requestName, requestType, packageManager, packageName, packageVersion, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = {
                request_type: requestType,
                request_name: requestName,
                package_manager: packageManager,
                packages: [
                    { name: packageName, version: packageVersion },
                ],
            };
            const config = {
                headers: {
                    "User-Agent": "npm",
                    "From": "host",
                    "Content-length": Buffer.byteLength(JSON.stringify(payload)),
                    "Authorization": "Bearer " + accessToken,
                },
            };
            const url = config_js_1.BASE_URL + config_js_1.AUDIT_ENDPOINT;
            const { data } = yield axios_1.default.post(url, payload, config);
            return data;
        }
        catch (error) {
            console.error(chalk_1.default.red(JSON.stringify(error.response.data)));
            return;
        }
    });
}
exports.default = auditPackage;
