import {IDatabase} from "pg-promise";
import {
    DataValues,
    IFilter,
    IList,
    IRepo,
    ISettings,
    Repository,
    TypeRepository,
    View,
    Where
} from "../types";
import _ from "lodash";
import {allSql, countSql, getSql, insertSql, listSql, updateSql} from "../sqlBuilder/sql-template";
import {prepareWhereData, prepareWhereSQL} from "../sqlBuilder/sql-where-builder";

const buildRepoAction = <Entity>(db : IDatabase<any>, repo_config: IRepo<Entity>, type: TypeRepository = 'repo') => {

    const { schema, table } = repo_config;

    const queryMany = async (sql: string, data: Record<string, any>) => {
        try {
            return db.manyOrNone(sql, data);
        } catch (e) {
            console.error(e);
            throw { error: 'sql error' };
        }
    };

    const queryOne = async(sql: string, data: Record<string, any>) => {
        try {
            console.log('SQL: ', sql);
            return db.oneOrNone(sql, data);
        } catch (e) {
            console.error(e);
            throw { error: 'sql error' };
        }
    };

    const getFilterOption = (custom_filter: IFilter<Entity> = {}) => ({ ...repo_config.default_filter, ...custom_filter });

    const create = async (data: DataValues<Entity>, returning?: keyof Entity) => {
        if (!Object.keys(data).length) throw { error: 'Update SQL [data] cannot be empty' };
        const omit_data = _.pick(data, repo_config.create || []);
        const sql = insertSql(schema, table, omit_data, returning as string);

        return queryOne(sql, omit_data);
    };

    const update = async (where: Where<Entity>, data: DataValues<Entity>, settings: ISettings<Entity> = {}) => {
        const { custom_filter = {} } = settings;

        if (!Object.keys(where || {}).length) throw { error: 'Update SQL [where] cannot be empty' };
        if (!Object.keys(data || {}).length) throw { error: 'Update SQL [data] cannot be empty' };

        const omit_where = _.pick(where, repo_config.update || []) as Where<Entity>;
        const omit_data = _.pick(data, repo_config.update || []);

        const where_sql = prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const sql = updateSql(schema, table, omit_data, where_sql);

        return queryOne(sql, { ...omit_where, ...omit_data });
    };

    const get = async (where: Where<Entity>, settings: ISettings<Entity> = {}) => {
        const { custom_filter } = settings;
        if (!Object.keys(where).length) throw { error: 'Update SQL [where] cannot be empty' };

        const omit_where = _.pick(where, repo_config.update || []) as Where<Entity>;
        const where_sql = prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const where_data = prepareWhereData(where, getFilterOption(custom_filter));
        const sql = getSql(schema, table, where_sql);

        return queryOne(sql, where_data);
    };

    const getAll = async (where: Where<Entity>, settings: ISettings<Entity> = {}) => {
        const { custom_filter } = settings;
        if (!Object.keys(where).length) throw { error: 'Update SQL [where] cannot be empty' };

        const omit_where = _.pick(where, repo_config.list || [])  as Where<Entity>;
        const where_sql = prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const where_data = prepareWhereData(where, getFilterOption(custom_filter));
        const sql = allSql(schema, table, where_sql);

        return queryMany(sql, where_data);
    };

    const exist = async (where: Where<Entity>, settings: ISettings<Entity> = {}) => {
        const result = await get(where, settings);

        return !!result;
    };

    const list = async ({
            filter = {},
            limit = 10,
            order_by,
            offset = 0 } : IList<Entity>,
        settings :ISettings<Entity> = {},
    ) => {
        const { custom_filter, skip_item_limit = false } = settings;

        if (order_by?.field && !(repo_config.list || [])?.find(key => key === order_by?.field)) throw { error: `Cannot order by [${order_by?.field}]` };

        const omit_where = _.pick(filter, repo_config.list || [])  as Where<Entity>;
        const where_sql = prepareWhereSQL(omit_where, getFilterOption(custom_filter));
        const where_data = prepareWhereData(omit_where, getFilterOption(custom_filter));

        const sql = listSql(schema, table, where_sql, order_by);
        const count_filtered = countSql(schema, table, where_sql);
        const count_total = countSql(schema, table);
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
    }

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

export const buildRepo = (db: IDatabase<any>) => <Entity>(config: IRepo<Entity>) => buildRepoAction(db, config, 'repo') as Repository<Entity>
export const buildView = (db: IDatabase<any>) => <Entity>(config: IRepo<Entity>) => buildRepoAction(db, config, 'view') as View<Entity>;