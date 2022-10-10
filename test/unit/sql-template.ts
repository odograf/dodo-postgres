import assert from "assert";
import {allSql, countSql, getSql, insertSql, listSql, updateSql} from "../../src/sqlBuilder/sql-template";

describe("Sql Template", function () {
    it("insert", async function () {

        const data = {
            name: 'Juzek',
            age: 25,
        }

        const result_field = insertSql('test', 'table', data)

        const test_output = 'INSERT INTO test.table ("name", "age") VALUES ($[name], $[age]) RETURNING id'

        assert.deepStrictEqual(result_field, test_output);
    });
    it("update", async function () {

        const data = {
            name: 'Juzek',
            age: 25,
        }

        const result_field = updateSql('test', 'table', data, 'WHERE id = [id]' )

        const test_output = 'UPDATE test.table SET "name" = $[name], "age" = $[age] WHERE id = [id] RETURNING id'

        assert.deepStrictEqual(result_field, test_output);
    });

    it("get", async function () {

        const data = {
            name: 'Juzek',
            age: 25,
        }

        const result_field = getSql('test', 'table','WHERE id = [id]' )

        const test_output = 'SELECT * FROM test.table WHERE id = [id] LIMIT 1';

        assert.deepStrictEqual(result_field, test_output);
    });

    it("all", async function () {

        const data = {
            name: 'Juzek',
            age: 25,
        }

        const result_field = allSql('test', 'table','WHERE id = [id]')

        const test_output = 'SELECT * FROM test.table WHERE id = [id]';

        assert.deepStrictEqual(result_field, test_output);
    });

    it("list", async function () {

        interface testInterface {
            id: string,
            name: string
        }

        const result_field = listSql<testInterface>('test', 'table','WHERE id = [id]', { field: 'id', order: 'ASC'})

        const test_output = 'SELECT * FROM test.table WHERE id = [id] ORDER BY "id" ASC LIMIT $[limit] OFFSET $[offset]';

        assert.deepStrictEqual(result_field, test_output);
    });

    it("count", async function () {

        const result_field = countSql('test', 'table','WHERE id = [id]')

        const test_output = 'SELECT count(*) ::integer FROM test.table WHERE id = [id]';

        assert.deepStrictEqual(result_field, test_output);
    });
});
