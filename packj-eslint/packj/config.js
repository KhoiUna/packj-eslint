"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRANT_TYPE = exports.HOSTNAME = exports.PACKJ_VERSION = exports.CREDS_FILE_PATH = exports.AUDIT_ENDPOINT = exports.REDIRECT_ENDPOINT = exports.TOKEN_ENDPOINT = exports.SESSION_ENDPOINT = exports.AUTH_ENDPOINT = exports.BASE_URL = void 0;
const os_1 = __importDefault(require("os"));
exports.BASE_URL = "https://packj.dev";
exports.AUTH_ENDPOINT = "/oauth/authorize";
exports.SESSION_ENDPOINT = "/api/v1/cli/npm/sessions";
exports.TOKEN_ENDPOINT = "/oauth/token";
exports.REDIRECT_ENDPOINT = "/oauth/code/callback";
exports.AUDIT_ENDPOINT = "/api/v1/audit";
exports.CREDS_FILE_PATH = os_1.default.homedir() + "/.packj.creds";
exports.PACKJ_VERSION = "0.15";
exports.HOSTNAME = os_1.default.hostname();
exports.GRANT_TYPE = "code";
