"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
exports.init = (db_config) => {
    try {
        const pgp = pg_promise_1.default({ /* Initialization Options */});
        const connection = pgp({
            user: db_config.user,
            password: db_config.password,
            host: db_config.host || 'localhost',
            database: db_config.database,
            port: db_config.port || 5432,
        });
        return connection;
    }
    catch (e) {
        console.error('connection not working', e);
        throw new Error('connection not working');
    }
};
