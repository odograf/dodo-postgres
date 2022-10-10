import {queryField} from "./sql-helper";
import {IFilter, Where, where_type} from "../types";
import {entries} from "../helper";

export const whereFactory: Record<where_type, (field: string) => string>  = {
    equal: (field) => `${field} = ${queryField(field)}`,
    like: (field) => `${field} ILIKE ${queryField(field)}`,
    in: (field) => `${field} IN (${queryField(`${field}:csv`)})`,
    betweenDate: (field) => `${field} BETWEEN $[${field}_from] AND $[${field}_to]`,
    more: (field) => `${field} > ${queryField(field)}`,
    moreOrEqual: (field) => `${field} >= ${queryField(field)}`,
    less: (field) => `${field} < ${queryField(field)}`,
    lessOrEqual: (field) => `${field} <= ${queryField(field)}`,
    notNull: (field) => `${field} IS NOT NULL`,
}

export const prepareWhereSQL = <Entity>(data: Where<Entity>, where_config: IFilter<Entity>): string => {
    const field_list = Object.keys(data) as (keyof  Where<Entity>)[] ;

    const where = field_list.map(field => {
        const where_type = where_config[field] as where_type;
        return whereFactory[where_type](field as string);
    });

    return where.length ? `WHERE ${where.join(' AND ')}` : '';
}

export const prepareWhereData = <Entity>(data: Where<Entity>, where_config: IFilter<Entity>) => {
    const newData: Record<string, string | number | undefined> = {};

    const afterEntries = entries(data);

    afterEntries.forEach(([field, value]) => {
        const where_type = where_config[field];

        if (where_type === 'betweenDate' && typeof value === 'object' && value !== null) {
            newData[`${field}_from`] = value.from;
            newData[`${field}_to`] = value.to;
        } else if (typeof value === 'string' || typeof value === 'number') {
            newData[field as string] = value
        }
    });

    return newData;
};