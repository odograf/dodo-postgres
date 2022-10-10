import assert from "assert";
import {whereFactory} from "../../src/sqlBuilder/sql-where-builder";

describe("Sql whereFactory", function () {
    it("equal", async function () {
        const field = 'name'
        const result_field = whereFactory.equal(field)

        assert.deepStrictEqual(result_field, 'name = $[name]');
    });
    it("like", async function () {
        const field = 'name'
        const result_field = whereFactory.like(field)

        assert.deepStrictEqual(result_field, 'name ILIKE $[name]');
    });
    it("in", async function () {
        const field = 'name'
        const result_field = whereFactory.in(field)

        assert.deepStrictEqual(result_field, 'name IN ($[name:csv])');
    });
    it("between date", async function () {
        const field = 'name'
        const result_field = whereFactory.betweenDate(field)

        assert.deepStrictEqual(result_field, 'name BETWEEN $[name_from] AND $[name_to]');
    });
    it("more", async function () {
        const field = 'name'
        const result_field = whereFactory.more(field)

        assert.deepStrictEqual(result_field, 'name > $[name]');
    });
    it("more or equal", async function () {
        const field = 'name'
        const result_field = whereFactory.moreOrEqual(field)

        assert.deepStrictEqual(result_field, 'name >= $[name]');
    });
    it("less", async function () {
        const field = 'name'
        const result_field = whereFactory.less(field)

        assert.deepStrictEqual(result_field, 'name < $[name]');
    });
    it("less or equal", async function () {
        const field = 'name'
        const result_field = whereFactory.lessOrEqual(field)

        assert.deepStrictEqual(result_field, 'name <= $[name]');
    });
    it("not null", async function () {
        const field = 'name'
        const result_field = whereFactory.notNull(field)

        assert.deepStrictEqual(result_field, 'name IS NOT NULL');
    });
});
