"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const sql_template_1 = require("../../src/sqlBuilder/sql-template");
describe("Sql Template", function () {
    it("insert", async function () {
        const data = {
            name: 'Juzek',
            age: 25,
        };
        const result_field = sql_template_1.insertSql('test', 'table', data);
        const test_output = 'INSERT INTO test.table ("name", "age") VALUES ($[name], $[age]) RETURNING id';
        assert_1.default.deepStrictEqual(result_field, test_output);
    });
    it("update", async function () {
        const data = {
            name: 'Juzek',
            age: 25,
        };
        const result_field = sql_template_1.updateSql('test', 'table', data, 'WHERE id = [id]');
        const test_output = 'UPDATE test.table SET "name" = $[name], "age" = $[age] WHERE id = [id] RETURNING id';
        assert_1.default.deepStrictEqual(result_field, test_output);
    });
    it("get", async function () {
        const data = {
            name: 'Juzek',
            age: 25,
        };
        const result_field = sql_template_1.getSql('test', 'table', 'WHERE id = [id]');
        const test_output = 'SELECT * FROM test.table WHERE id = [id] LIMIT 1';
        assert_1.default.deepStrictEqual(result_field, test_output);
    });
    it("all", async function () {
        const data = {
            name: 'Juzek',
            age: 25,
        };
        const result_field = sql_template_1.allSql('test', 'table', 'WHERE id = [id]');
        const test_output = 'SELECT * FROM test.table WHERE id = [id]';
        assert_1.default.deepStrictEqual(result_field, test_output);
    });
    it("list", async function () {
        const result_field = sql_template_1.listSql('test', 'table', 'WHERE id = [id]', { field: 'id', order: 'ASC' });
        const test_output = 'SELECT * FROM test.table WHERE id = [id] ORDER BY "id" ASC LIMIT $[limit] OFFSET $[offset]';
        assert_1.default.deepStrictEqual(result_field, test_output);
    });
    it("count", async function () {
        const result_field = sql_template_1.countSql('test', 'table', 'WHERE id = [id]');
        const test_output = 'SELECT count(*) ::integer FROM test.table WHERE id = [id]';
        assert_1.default.deepStrictEqual(result_field, test_output);
    });
});
