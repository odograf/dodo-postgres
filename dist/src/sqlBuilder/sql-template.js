"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countSql = exports.listSql = exports.allSql = exports.getSql = exports.updateSql = exports.insertSql = void 0;
const sql_helper_1 = require("./sql-helper");
exports.insertSql = (schema, table, data, returning = 'id') => {
    const record_name = Object.keys(data).map(el => `"${el}"`);
    const values = Object.keys(data).map(field => sql_helper_1.queryField(field)).join(', ');
    return `INSERT INTO ${schema}.${table} (${record_name.join(', ')}) VALUES (${values}) RETURNING ${returning}`;
};
exports.updateSql = (schema, table, data, where, returning = 'id') => {
    const record_name = Object.keys(data);
    const values = record_name.map(field => `"${field}" = ${sql_helper_1.queryField(field)}`).join(', ');
    return `UPDATE ${schema}.${table} SET ${values} ${where} RETURNING ${returning}`;
};
exports.getSql = (schema, table, where) => `SELECT * FROM ${schema}.${table} ${where} LIMIT 1`;
exports.allSql = (schema, table, where) => `SELECT * FROM ${schema}.${table} ${where}`;
exports.listSql = (schema, table, where, order_by) => `SELECT * FROM ${schema}.${table} ${where} ORDER BY "${(order_by === null || order_by === void 0 ? void 0 : order_by.field) || 'id'}" ${(order_by === null || order_by === void 0 ? void 0 : order_by.order) || 'ASC'} LIMIT ${sql_helper_1.queryField('limit')} OFFSET ${sql_helper_1.queryField('offset')}`;
exports.countSql = (schema, table, where) => `SELECT count(*) ::integer FROM ${schema}.${table} ${where || ''}`;
