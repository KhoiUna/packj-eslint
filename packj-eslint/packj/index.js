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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const main_js_1 = __importDefault(require("./audit/main.js"));
const code_js_1 = __importDefault(require("./auth/code.js"));
const token_js_1 = __importDefault(require("./auth/token.js"));
const session_js_1 = __importDefault(require("./auth/session.js"));
const node_fs_1 = require("node:fs");
const readline = __importStar(require("node:readline"));
const fs = __importStar(require("node:fs"));
const config_js_1 = require("./config.js");
const usageText = `
  usage: main COMMAND [-f] PACKAGE [DEPENDENCY_FILE]

  COMMAND:
    auth    Authenticate user with the server.
    audit   Audit packages for malware/risky attributes

  FLAGS:
    -f DEPENDENCY_FILE: Audit dependency file
  
  ARGS: 
    PACKAGES: Audit packages (e.g., npm:axios), optionally specific version (e.g., npm:axios:1.3.5) 
`;
const args = process.argv;
if (args.length < 3) {
    console.log(usageText);
    process.exit();
}
const option = args[2];
// TODO: get from commandline
const requestName = 'packj-npm';
const requestType = 'cli';
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    if (option === "auth") {
        var fetch = 0;
        try {
            const fileText = (0, node_fs_1.readFileSync)(config_js_1.CREDS_FILE_PATH, "utf8");
            const token = JSON.parse(fileText).token;
            const expiresAt = new Date(token.expires).valueOf();
            if (expiresAt < Date.now()) {
                throw "Tokens expired! Reauthenticate...";
            }
            console.log("Already authenticated. Nothing to do.");
            process.exit(1);
        }
        catch (err) {
            console.log(err);
            if (err.code !== "ENOENT") {
                // nothing to do, fall through
            }
            else if (err.code !== "ENOENT") {
            }
            else {
                console.error(chalk_1.default.red("Error: Error loading credentials. Ignoring."));
            }
        }
        try {
            const data = yield (0, session_js_1.default)();
            if (!data)
                process.exit(1);
            const { id: clientID, auth_url } = data;
            // get auth code
            const authCode = yield (0, code_js_1.default)(clientID);
            if (!authCode)
                process.exit(1);
            // get auth token
            const authTokenData = yield (0, token_js_1.default)(clientID, authCode);
            if (!authTokenData)
                process.exit(1);
            // TODO: Write data to ~/.packj.creds
            const content = {
                auth_url,
                code: authCode,
                id: clientID,
                token: Object.assign(Object.assign({}, authTokenData), { expires: new Date(Date.now() + 3600 * 1000) }),
            };
            (0, node_fs_1.writeFileSync)(config_js_1.CREDS_FILE_PATH, JSON.stringify(content), { flag: "w" });
            console.log("Successfully authenticated (account activated).");
        }
        catch (err) {
            console.error(chalk_1.default.red("Error: Failed to authenticate: @{err}"));
        }
        process.exit();
    }
    if (option === "audit") {
        if (args.length < 4) {
            console.log(usageText);
            process.exit();
        }
        if (!(0, node_fs_1.existsSync)(config_js_1.CREDS_FILE_PATH)) {
            console.error(chalk_1.default.red("Error: User not authenticated. Run 'auth' before 'audit'"));
            process.exit(1);
        }
        const fileText = (0, node_fs_1.readFileSync)(config_js_1.CREDS_FILE_PATH, "utf8");
        const accessToken = JSON.parse(fileText).token.access_token;
        if (!accessToken) {
            console.error(chalk_1.default.red("Error: Invalid client ID"));
            process.exit(1);
        }
        const flag = args[3];
        if (flag === '-f') {
            const dependencyFile = args[4];
            if (!dependencyFile || dependencyFile.split(':').length > 2) {
                console.log(usageText);
                process.exit();
            }
            const [packageManager, filePath] = dependencyFile.split(':');
            if (!packageManager || !filePath) {
                console.log(chalk_1.default.red('Error: Invalid package file format.'));
                process.exit(1);
            }
            if (!(0, node_fs_1.existsSync)(filePath)) {
                console.error(chalk_1.default.red("Error: Invalid file path"));
                process.exit(1);
            }
            if (packageManager === 'pypi') {
                const readInterface = readline.createInterface({
                    input: fs.createReadStream(filePath),
                });
                const output = [];
                try {
                    for (var _d = true, readInterface_1 = __asyncValues(readInterface), readInterface_1_1; readInterface_1_1 = yield readInterface_1.next(), _a = readInterface_1_1.done, !_a;) {
                        _c = readInterface_1_1.value;
                        _d = false;
                        try {
                            const line = _c;
                            const [packageName, packageVersion] = line.split('==');
                            const response = yield (0, main_js_1.default)(requestName, requestType, packageManager, packageName, packageVersion, accessToken);
                            if (!response) {
                                console.error(chalk_1.default.red('Error: Error auditing dependency file'));
                                process.exit(1);
                            }
                            const formattedResponse = {
                                package_manager: response.package_manager,
                                package_name: response.packages[0].name,
                                package_version: response.packages[0].version,
                                risks: response.packages[0].risks,
                                url: response.url
                            };
                            output.push(formattedResponse);
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = readInterface_1.return)) yield _b.call(readInterface_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                console.table(output, Object.keys(output[0]));
                process.exit();
            }
            const packageFile = (0, node_fs_1.readFileSync)(filePath, 'utf8');
            const dependencyObject = JSON.parse(packageFile).dependencies;
            const output = [];
            for (const [packageName, packageVersion] of Object.entries(dependencyObject)) {
                const response = yield (0, main_js_1.default)(requestName, requestType, packageManager, packageName, packageVersion, accessToken);
                if (!response) {
                    console.error(chalk_1.default.red('Error: Error auditing package.'));
                    process.exit(1);
                }
                const formattedResponse = {
                    package_manager: response.package_manager,
                    package_name: response.packages[0].name,
                    package_version: response.packages[0].version,
                    risks: response.packages[0].risks,
                    url: response.url
                };
                output.push(formattedResponse);
            }
            console.table(output, Object.keys(output[0]));
            process.exit();
        }
        const [packageManager, packageName, packageVersion] = args[3].split(":");
        if (!packageManager || !packageName) {
            console.error(chalk_1.default.red("Error: Invalid input"));
            console.log(usageText);
            process.exit(1);
        }
        // Audit package
        const response = yield (0, main_js_1.default)(requestName, requestType, packageManager, packageName, packageVersion, accessToken);
        if (!response)
            process.exit(1);
        const formattedResponse = {
            package_manager: response.package_manager,
            package_name: response.packages[0].name,
            package_version: response.packages[0].version,
            risks: response.packages[0].risks,
            url: response.url
        };
        console.table([formattedResponse], Object.keys(formattedResponse));
        process.exit();
    }
}))();
