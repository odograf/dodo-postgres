import {IDatabase} from "pg-promise";

export type where_type =
    'equal' |
    'like' |
    'in' |
    'betweenDate' |
    'more' |
    'moreOrEqual' |
    'less' |
    'lessOrEqual' |
    'notNull';

export type IFilter<Entity> = Partial<Record<keyof Entity, where_type>>

export interface IRepo<Entity> {
    schema: string,
    table: string,
    create?: (keyof Entity)[]
    update?: (keyof Entity)[]
    list?: (keyof Entity)[],
    default_filter?: IFilter<Entity>
}

export interface ISettings<Entity> {
    custom_filter?: IFilter<Entity>,
    skip_item_limit?: boolean,
    returning?: string,
}

export type OrderBy<Entity> = {
    field: keyof Entity,
    order: 'ASC' | 'DESC'
}


export type DataValues<Entity> = Partial<Entity>

export type WhereValues = string | number | { from: string, to: string }

export type Where<Entity> = Partial<Record<keyof Entity, WhereValues>>

export type TypeRepository = 'view' | 'repo';


export interface IList<Entity> {
    filter?: Where<Entity>,
    limit?: number,
    offset?: number,
    order_by?: OrderBy<Entity>
}


export interface RepositoryDefault<Entity> {
    schema: string,
    table: string,
    db: IDatabase<any>,
    queryMany: (sql: string, data: Record<string, any>) => Promise<any[]>
    queryOne: (sql: string, data: Record<string, any>) => Promise<any>
    get: (where: Where<Entity>, settings?: ISettings<Entity>) => Promise<Entity>
    getAll: (where: Where<Entity>, settings?: ISettings<Entity>) => Promise<Entity[]>
    exist: (where: Where<Entity>, settings?: ISettings<Entity>) => Promise<boolean>
    list: (option: IList<Entity>, settings?: ISettings<Entity>) => Promise<{
        item: Entity[],
        filtered: number,
        total: number
    }>
}

export interface View<Entity> extends RepositoryDefault<Entity> {
    type: 'view'
}

export interface Repository<Entity> extends RepositoryDefault<Entity> {
    type: 'repo'
    create:  (data: DataValues<Entity>, returning?: keyof Entity) => Promise<string | number>
    update:  (where: Where<Entity>, data: DataValues<Entity>, settings?: ISettings<Entity>) => Promise<Entity>
}
