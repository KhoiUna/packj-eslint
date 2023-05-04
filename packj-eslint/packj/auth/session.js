"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const readline = __importStar(require("node:readline/promises"));
const signal = AbortSignal.timeout(60000); // 1 minute
signal.addEventListener("abort", () => {
    console.log("\nSession 1 minute timed out!");
}, { once: true });
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function setupSession() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = {
                hostname: config_js_1.HOSTNAME,
                auth_type: config_js_1.GRANT_TYPE,
            };
            const config = {
                headers: {
                    "User-Agent": "npm",
                    From: config_js_1.HOSTNAME,
                },
            };
            const url = config_js_1.BASE_URL + config_js_1.SESSION_ENDPOINT;
            const { data } = yield axios_1.default.post(url, qs_1.default.stringify(params), config);
            // Validate data
            if (!data.auth_url)
                throw new Error("Invalid session data");
            if (!data.id)
                throw new Error("Invalid session data");
            // Manual user auth
            const prompt = "Visit the site below in your browser, follow the steps to authenticate, and then come back here to continue [ENTER]\n\t" +
                data.auth_url +
                "\n";
            const _ = yield rl.question(prompt, { signal });
            return data;
        }
        catch (error) {
            console.error(chalk_1.default.red("Error setting up session"));
            console.error(chalk_1.default.red(error));
            return;
        }
    });
}
exports.default = setupSession;
