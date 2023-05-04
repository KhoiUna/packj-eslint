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
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../config.js");
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
function getAuthToken(clientID, authCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = {
                client_id: clientID,
                code: authCode,
                grant_type: "authorization_code",
                redirect_uri: config_js_1.REDIRECT_ENDPOINT,
            };
            const config = {
                headers: {
                    "User-Agent": "npm",
                    From: config_js_1.HOSTNAME,
                },
            };
            const url = config_js_1.BASE_URL + config_js_1.TOKEN_ENDPOINT;
            const { data } = yield axios_1.default.post(url, qs_1.default.stringify(params), config);
            if (!data.access_token)
                throw new Error("Invalid auth token");
            if (!data.token_type)
                throw new Error("Invalid auth token");
            if (!data.scope)
                throw new Error("Invalid auth token");
            if (!data.refresh_token)
                throw new Error("Invalid auth token");
            return data;
        }
        catch (error) {
            console.error(chalk_1.default.red("Error getting auth token"));
            console.error(chalk_1.default.red(error));
            return;
        }
    });
}
exports.default = getAuthToken;
