"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildView = exports.buildRepo = void 0;
const lodash_1 = __importDefault(require("lodash"));
const sql_template_1 = require("../sqlBuilder/sql-template");
const sql_where_builder_1 = require("../sqlBuilder/sql-where-builder");
const buildRepoAction = (db, repo_config, type = 'repo') => {
    const { schema, table } = repo_config;
    const queryMany = async (sql, data) => {
        try {
            return db.manyOrNone(sql, data);
        }
        catch (e) {
            console.error(e);
            throw { error: 'sql error' };
        }
    };
    const queryOne = async (sql, data) => {
        try {
            console.log('SQL: ', sql);
            return db.oneOrNone(sql, data);
        }
        catch (e) {
            console.error(e);
            throw { error: 'sql error' };
        }
    };
    const getFilterOption = (custom_filter = {}) => ({ ...repo_config.default_filter, ...custom_filter });
    const create = async (data, returning) => {
        if (!Object.keys(data).length)
            throw { error: 'Update SQL [data] cannot be empty' };
        const omit_data = lodash_1.default.pick(data, repo_config.create || []);
        const sql = sql_template_1.insertSql(schema, table, omit_data, returning);
        return queryOne(sql, omit_data);
    };
    const update = async (where, data, settings = {}) => {
        const { custom_filter = {} } = settings;
        if (!Object.keys(where || {}).length)
            throw { error: 'Update SQL [where] cannot be empty' };
        if (!Object.keys(data || {}).length)
            throw { error: 'Update SQL [data] cannot be empty' };
        const omit_where = lodash_1.default.pick(where, repo_config.update || []);
        const omit_data = lodash_1.default.pick(data, repo_config.update || []);
        const where_sql = sql_where_builder_1.prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const sql = sql_template_1.updateSql(schema, table, omit_data, where_sql);
        return queryOne(sql, { ...omit_where, ...omit_data });
    };
    const get = async (where, settings = {}) => {
        const { custom_filter } = settings;
        if (!Object.keys(where).length)
            throw { error: 'Update SQL [where] cannot be empty' };
        const omit_where = lodash_1.default.pick(where, repo_config.update || []);
        const where_sql = sql_where_builder_1.prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const where_data = sql_where_builder_1.prepareWhereData(where, getFilterOption(custom_filter));
        const sql = sql_template_1.getSql(schema, table, where_sql);
        return queryOne(sql, where_data);
    };
    const getAll = async (where, settings = {}) => {
        const { custom_filter } = settings;
        if (!Object.keys(where).length)
            throw { error: 'Update SQL [where] cannot be empty' };
        const omit_where = lodash_1.default.pick(where, repo_config.list || []);
        const where_sql = sql_where_builder_1.prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const where_data = sql_where_builder_1.prepareWhereData(where, getFilterOption(custom_filter));
        const sql = sql_template_1.allSql(schema, table, where_sql);
        return queryMany(sql, where_data);
    };
    const exist = async (where, settings = {}) => {
        const result = await get(where, settings);
        return !!result;
    };
    const list = async ({ filter = {}, limit = 10, order_by, offset = 0 }, settings = {}) => {
        var _a;
        const { custom_filter, skip_item_limit = false } = settings;
        if ((order_by === null || order_by === void 0 ? void 0 : order_by.field) && !((_a = (repo_config.list || [])) === null || _a === void 0 ? void 0 : _a.find(key => key === (order_by === null || order_by === void 0 ? void 0 : order_by.field))))
            throw { error: `Cannot order by [${order_by === null || order_by === void 0 ? void 0 : order_by.field}]` };
        const omit_where = lodash_1.default.pick(filter, repo_config.list || []);
        const where_sql = sql_where_builder_1.prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const where_data = sql_where_builder_1.prepareWhereData(omit_where, getFilterOption(custom_filter));
        const sql = sql_template_1.listSql(schema, table, where_sql, order_by);
        const count_filtered = sql_template_1.countSql(schema, table, where_sql);
        const count_total = sql_template_1.countSql(schema, table);
        const item = await queryMany(sql, { ...where_data, limit, offset });
        const { count: filtered } = await queryOne(count_filtered, where_data);
        const { count: total } = await queryOne(count_total, {});
        return { item, filtered, total };
    };
    const view = {
        type: 'view',
        schema,
        table,
        db,
        queryMany,
        queryOne,
        get,
        getAll,
        list,
        exist,
    };
    if (type === 'view') {
        return view;
    }
    return {
        ...view,
        create,
        update,
        type: 'repo'
    };
};
exports.buildRepo = (db) => (config) => buildRepoAction(db, config, 'repo');
exports.buildView = (db) => (config) => buildRepoAction(db, config, 'view');
