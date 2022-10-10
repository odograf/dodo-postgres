"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareWhereData = exports.prepareWhereSQL = exports.whereFactory = void 0;
const sql_helper_1 = require("./sql-helper");
const helper_1 = require("../helper");
exports.whereFactory = {
    equal: (field) => `${field} = ${sql_helper_1.queryField(field)}`,
    like: (field) => `${field} ILIKE ${sql_helper_1.queryField(field)}`,
    in: (field) => `${field} IN (${sql_helper_1.queryField(`${field}:csv`)})`,
    betweenDate: (field) => `${field} BETWEEN $[${field}_from] AND $[${field}_to]`,
    more: (field) => `${field} > ${sql_helper_1.queryField(field)}`,
    moreOrEqual: (field) => `${field} >= ${sql_helper_1.queryField(field)}`,
    less: (field) => `${field} < ${sql_helper_1.queryField(field)}`,
    lessOrEqual: (field) => `${field} <= ${sql_helper_1.queryField(field)}`,
    notNull: (field) => `${field} IS NOT NULL`,
};
exports.prepareWhereSQL = (data, where_config) => {
    const field_list = Object.keys(data);
    const where = field_list.map(field => {
        const where_type = where_config[field];
        return exports.whereFactory[where_type](field);
    });
    return where.length ? `WHERE ${where.join(' AND ')}` : '';
};
exports.prepareWhereData = (data, where_config) => {
    const newData = {};
    const afterEntries = helper_1.entries(data);
    afterEntries.forEach(([field, value]) => {
        const where_type = where_config[field];
        if (where_type === 'betweenDate' && typeof value === 'object' && value !== null) {
            newData[`${field}_from`] = value.from;
            newData[`${field}_to`] = value.to;
        }
        else if (typeof value === 'string' || typeof value === 'number') {
            newData[field] = value;
        }
    });
    return newData;
};
