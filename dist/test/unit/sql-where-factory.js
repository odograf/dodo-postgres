"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const sql_where_builder_1 = require("../../src/sqlBuilder/sql-where-builder");
describe("Sql whereFactory", function () {
    it("equal", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.equal(field);
        assert_1.default.deepStrictEqual(result_field, 'name = $[name]');
    });
    it("like", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.like(field);
        assert_1.default.deepStrictEqual(result_field, 'name ILIKE $[name]');
    });
    it("in", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.in(field);
        assert_1.default.deepStrictEqual(result_field, 'name IN ($[name:csv])');
    });
    it("between date", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.betweenDate(field);
        assert_1.default.deepStrictEqual(result_field, 'name BETWEEN $[name_from] AND $[name_to]');
    });
    it("more", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.more(field);
        assert_1.default.deepStrictEqual(result_field, 'name > $[name]');
    });
    it("more or equal", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.moreOrEqual(field);
        assert_1.default.deepStrictEqual(result_field, 'name >= $[name]');
    });
    it("less", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.less(field);
        assert_1.default.deepStrictEqual(result_field, 'name < $[name]');
    });
    it("less or equal", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.lessOrEqual(field);
        assert_1.default.deepStrictEqual(result_field, 'name <= $[name]');
    });
    it("not null", async function () {
        const field = 'name';
        const result_field = sql_where_builder_1.whereFactory.notNull(field);
        assert_1.default.deepStrictEqual(result_field, 'name IS NOT NULL');
    });
});
