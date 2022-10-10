import pgPromise, {IDatabase} from 'pg-promise';

type DBConfig = {
  user: string,
  password: string,
  host?: string,
  database: string,
  port?: number
}

export const init = (db_config: DBConfig) => {
  try {
    const pgp = pgPromise({/* Initialization Options */});
    const connection: IDatabase<any> = pgp({
      user: db_config.user,
      password: db_config.password,
      host: db_config.host || 'localhost',
      database: db_config.database,
      port: db_config.port || 5432,
    });

    return connection;
  } catch (e) {
    console.error('connection not working', e);
    throw new Error('connection not working')
  }
};