import {queryField} from "./sql-helper";
import {OrderBy} from "../types";

export const insertSql = (schema: string, table: string, data: any, returning:string = 'id') => {
    const record_name = Object.keys(data).map(el => `"${el}"`);
    const values = Object.keys(data).map(field => queryField(field)).join(', ');

    return `INSERT INTO ${schema}.${table} (${record_name.join(', ')}) VALUES (${values}) RETURNING ${returning}`;
};

export const updateSql = (schema: string, table: string, data: any, where: string, returning = 'id') => {
    const record_name = Object.keys(data);
    const values = record_name.map(field => `"${field}" = ${queryField(field)}`).join(', ');

    return `UPDATE ${schema}.${table} SET ${values} ${where} RETURNING ${returning}`;
};

export const getSql = (schema: string, table: string, where: string) => `SELECT * FROM ${schema}.${table} ${where} LIMIT 1`;

export const allSql = (schema: string, table: string, where: string) => `SELECT * FROM ${schema}.${table} ${where}`;

export const listSql = <Entity>(schema: string, table: string, where: string, order_by?: OrderBy<Entity>) =>
    `SELECT * FROM ${schema}.${table} ${where} ORDER BY "${order_by?.field || 'id'}" ${order_by?.order || 'ASC'} LIMIT ${queryField('limit')} OFFSET ${queryField('offset')}`;

export const countSql = (schema: string, table: string, where?: string) =>
    `SELECT count(*) ::integer FROM ${schema}.${table} ${where || ''}`;
