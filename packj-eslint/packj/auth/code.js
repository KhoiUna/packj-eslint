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
const config_js_1 = require("../config.js");
const qs_1 = __importDefault(require("qs"));
const chalk_1 = __importDefault(require("chalk"));
const crypto_1 = __importDefault(require("crypto"));
function getAuthCode(clientID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const state = crypto_1.default
                .createHash("sha1")
                .update(Math.random().toString())
                .digest("hex");
            const params = {
                client_id: clientID,
                response_type: "code",
                scope: "audit",
                state,
            };
            const config = {
                headers: {
                    "User-Agent": "npm",
                    From: config_js_1.HOSTNAME,
                },
            };
            const url = config_js_1.BASE_URL + config_js_1.AUTH_ENDPOINT;
            const { data } = yield axios_1.default.post(url + "?" + qs_1.default.stringify(params), config);
            // Validate data
            if (!data.code)
                throw new Error("Invalid auth code");
            if (!data.state)
                throw new Error("Invalid auth code");
            return data.code;
        }
        catch (error) {
            console.error(chalk_1.default.red("Error getting auth code"));
            console.error(chalk_1.default.red(error));
            return;
        }
    });
}
exports.default = getAuthCode;
