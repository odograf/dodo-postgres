import assert from "assert";
import {prepareWhereData, prepareWhereSQL} from "../../src/sqlBuilder/sql-where-builder";
import { where_type } from '../../src/types'
describe("Sql prepareWhereSQL", function () {
    it("where equal", async function () {

        const data = { id: 1 }
        const where_type: Record<string, where_type> = { id: 'equal' }

        const result_field = prepareWhereSQL(data, where_type)

        assert.deepStrictEqual(result_field, 'WHERE id = $[id]');
    });
    it("where few fields", async function () {

        const data = { id: 1, name: 'abc', age: 123 }
        const where_type: Record<string, where_type> = { id: 'equal', name: 'like', age: 'notNull' }

        const result_field = prepareWhereSQL(data, where_type)

        assert.deepStrictEqual(result_field, 'WHERE id = $[id] AND name ILIKE $[name] AND age IS NOT NULL');
    });
});

describe("Sql prepareWhereData", function () {
    it("where equal", async function () {

        const data = { id: 1 }
        const where_type: Record<string, where_type> = { id: 'equal' }

        const result_field = prepareWhereData(data, where_type)

        assert.deepStrictEqual(result_field, { id: 1 });
    });
    it("where few fields", async function () {

        const data = { id: 1, date: { from: '2010:09:10', to: '2010:10:10'} }
        const where_type: Record<string, where_type> = { id: 'equal', date: 'betweenDate' }

        const result_field = prepareWhereData(data, where_type)

        assert.deepStrictEqual(result_field, {
            date_from: '2010:09:10',
            date_to: '2010:10:10',
            id: 1
        });
    });
});
