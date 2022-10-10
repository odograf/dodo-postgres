"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const sql_helper_1 = require("../../src/sqlBuilder/sql-helper");
describe("Sql Helper", function () {
    it("queryField", async function () {
        const field = 'name';
        const result_field = sql_helper_1.queryField(field);
        assert_1.default.deepStrictEqual(result_field, '$[name]');
    });
});
