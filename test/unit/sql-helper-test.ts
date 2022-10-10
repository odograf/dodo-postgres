import assert from "assert";
import {queryField} from "../../src/sqlBuilder/sql-helper";

describe("Sql Helper", function () {
  it("queryField", async function () {
    const field = 'name'
    const result_field = queryField(field)

    assert.deepStrictEqual(result_field, '$[name]');
  });
});
