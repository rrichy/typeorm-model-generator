"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeormDriver = require("typeorm/driver/oracle/OracleDriver");
const TomgUtils = require("../Utils");
const AbstractDriver_1 = require("./AbstractDriver");
class OracleDriver extends AbstractDriver_1.default {
    constructor() {
        super();
        this.defaultValues = new TypeormDriver.OracleDriver({
            options: {},
        }).dataTypeDefaults;
        this.standardPort = 1521;
        this.standardUser = "SYS";
        this.standardSchema = "";
        try {
            // eslint-disable-next-line import/no-extraneous-dependencies, global-require, import/no-unresolved
            this.Oracle = require("oracledb");
            this.Oracle.outFormat = this.Oracle.OBJECT;
        }
        catch (error) {
            TomgUtils.LogError("", false, error);
            throw error;
        }
    }
    async GetAllTables(schemas, dbNames) {
        const response = (await this.Connection.execute(`SELECT NULL AS TABLE_SCHEMA, TABLE_NAME, NULL AS DB_NAME FROM all_tables WHERE owner = (select user from dual)`)).rows;
        const ret = [];
        response.forEach((val) => {
            ret.push({
                columns: [],
                indices: [],
                relations: [],
                relationIds: [],
                sqlName: val.TABLE_NAME,
                tscName: val.TABLE_NAME,
                fileName: val.TABLE_NAME,
                database: dbNames.length > 1 ? val.DB_NAME : "",
                schema: val.TABLE_SCHEMA,
                fileImports: [],
            });
        });
        return ret;
    }
    async GetCoulmnsFromEntity(entities) {
        const response = (await this.Connection.execute(`SELECT utc.*, (select count(*) from USER_CONS_COLUMNS ucc
             JOIN USER_CONSTRAINTS uc ON  uc.CONSTRAINT_NAME = ucc.CONSTRAINT_NAME and uc.CONSTRAINT_TYPE='U'
            where ucc.column_name = utc.COLUMN_NAME AND ucc.table_name = utc.TABLE_NAME) IS_UNIQUE
           FROM USER_TAB_COLUMNS utc`)).rows;
        entities.forEach((ent) => {
            response
                .filter((filterVal) => filterVal.TABLE_NAME === ent.tscName)
                .forEach((resp) => {
                const tscName = resp.COLUMN_NAME;
                const options = {
                    name: resp.COLUMN_NAME,
                };
                if (resp.NULLABLE === "Y")
                    options.nullable = true;
                if (resp.IS_UNIQUE > 0)
                    options.unique = true;
                if (["password", "init_password"].includes(tscName))
                    options.select = false;
                const generated = resp.IDENTITY_COLUMN === "YES" ? true : undefined;
                const defaultValue = !resp.DATA_DEFAULT || resp.DATA_DEFAULT.includes('"')
                    ? undefined
                    : OracleDriver.ReturnDefaultValueFunction(resp.DATA_DEFAULT);
                const DATA_TYPE = resp.DATA_TYPE.replace(/\([0-9]+\)/g, "");
                const columnType = DATA_TYPE.toLowerCase();
                let tscType = "";
                switch (DATA_TYPE.toLowerCase()) {
                    case "char":
                        tscType = "string";
                        break;
                    case "nchar":
                        tscType = "string";
                        break;
                    case "nvarchar2":
                        tscType = "string";
                        break;
                    case "varchar2":
                        tscType = "string";
                        break;
                    case "long":
                        tscType = "string";
                        break;
                    case "raw":
                        tscType = "Buffer";
                        break;
                    case "long raw":
                        tscType = "Buffer";
                        break;
                    case "number":
                        tscType = "number";
                        break;
                    case "numeric":
                        tscType = "number";
                        break;
                    case "float":
                        tscType = "number";
                        break;
                    case "dec":
                        tscType = "number";
                        break;
                    case "decimal":
                        tscType = "number";
                        break;
                    case "integer":
                        tscType = "number";
                        break;
                    case "int":
                        tscType = "number";
                        break;
                    case "smallint":
                        tscType = "number";
                        break;
                    case "real":
                        tscType = "number";
                        break;
                    case "double precision":
                        tscType = "number";
                        break;
                    case "date":
                        tscType = "Date";
                        break;
                    case "timestamp":
                        tscType = "Date";
                        break;
                    case "timestamp with time zone":
                        tscType = "Date";
                        break;
                    case "timestamp with local time zone":
                        tscType = "Date";
                        break;
                    case "interval year to month":
                        tscType = "string";
                        break;
                    case "interval day to second":
                        tscType = "string";
                        break;
                    case "bfile":
                        tscType = "Buffer";
                        break;
                    case "blob":
                        tscType = "Buffer";
                        break;
                    case "clob":
                        tscType = "string";
                        break;
                    case "nclob":
                        tscType = "string";
                        break;
                    case "rowid":
                        tscType = "number";
                        break;
                    case "urowid":
                        tscType = "number";
                        break;
                    default:
                        tscType = "NonNullable<unknown>";
                        TomgUtils.LogError(`Unknown column type:${DATA_TYPE}`);
                        break;
                }
                if (this.ColumnTypesWithPrecision.some((v) => v === columnType)) {
                    if (resp.DATA_PRECISION !== null) {
                        options.precision = resp.DATA_PRECISION;
                    }
                    if (resp.DATA_SCALE !== null) {
                        options.scale = resp.DATA_SCALE;
                    }
                }
                if (this.ColumnTypesWithLength.some((v) => v === columnType)) {
                    options.length =
                        resp.DATA_LENGTH > 0 ? resp.DATA_LENGTH : undefined;
                }
                ent.columns.push({
                    generated,
                    type: columnType,
                    default: defaultValue,
                    options,
                    tscName,
                    tscType,
                });
            });
        });
        return entities;
    }
    async GetIndexesFromEntity(entities) {
        const response = (await this.Connection.execute(`SELECT ind.TABLE_NAME, ind.INDEX_NAME, col.COLUMN_NAME,ind.UNIQUENESS, CASE WHEN uc.CONSTRAINT_NAME IS NULL THEN 0 ELSE 1 END ISPRIMARYKEY
        FROM USER_INDEXES ind
        JOIN USER_IND_COLUMNS col ON ind.INDEX_NAME=col.INDEX_NAME
        LEFT JOIN USER_CONSTRAINTS uc ON  uc.INDEX_NAME = ind.INDEX_NAME
        ORDER BY col.INDEX_NAME ASC ,col.COLUMN_POSITION ASC`)).rows;
        entities.forEach((ent) => {
            const entityIndices = response.filter((filterVal) => filterVal.TABLE_NAME === ent.tscName);
            const indexNames = new Set(entityIndices.map((v) => v.INDEX_NAME));
            indexNames.forEach((indexName) => {
                const records = entityIndices.filter((v) => v.INDEX_NAME === indexName);
                const indexInfo = {
                    columns: [],
                    options: {},
                    name: records[0].INDEX_NAME,
                };
                if (records[0].ISPRIMARYKEY === 1)
                    indexInfo.primary = true;
                if (records[0].UNIQUENESS === "UNIQUE")
                    indexInfo.options.unique = true;
                records.forEach((record) => {
                    indexInfo.columns.push(record.COLUMN_NAME);
                });
                ent.indices.push(indexInfo);
            });
        });
        return entities;
    }
    async GetRelations(entities, schemas, dbNames, generationOptions) {
        const response = (await this.Connection.execute(`select owner.TABLE_NAME OWNER_TABLE_NAME,ownCol.POSITION OWNER_POSITION,ownCol.COLUMN_NAME OWNER_COLUMN_NAME,
        child.TABLE_NAME CHILD_TABLE_NAME ,childCol.COLUMN_NAME CHILD_COLUMN_NAME,
        owner.DELETE_RULE,
        owner.CONSTRAINT_NAME
        from user_constraints owner
        join user_constraints child on owner.r_constraint_name=child.CONSTRAINT_NAME and child.constraint_type in ('P','U')
        JOIN USER_CONS_COLUMNS ownCol ON owner.CONSTRAINT_NAME = ownCol.CONSTRAINT_NAME
        JOIN USER_CONS_COLUMNS childCol ON child.CONSTRAINT_NAME = childCol.CONSTRAINT_NAME AND ownCol.POSITION=childCol.POSITION
        ORDER BY OWNER_TABLE_NAME ASC, owner.CONSTRAINT_NAME ASC, OWNER_POSITION ASC`)).rows;
        const relationsTemp = [];
        const relationKeys = new Set(response.map((v) => v.CONSTRAINT_NAME));
        relationKeys.forEach((relationId) => {
            const rows = response.filter((v) => v.CONSTRAINT_NAME === relationId);
            const ownerTable = entities.find((v) => v.sqlName === rows[0].OWNER_TABLE_NAME);
            const relatedTable = entities.find((v) => v.sqlName === rows[0].CHILD_TABLE_NAME);
            if (!ownerTable || !relatedTable) {
                TomgUtils.LogError(`Relation between tables ${rows[0].OWNER_TABLE_NAME} and ${rows[0].CHILD_TABLE_NAME} wasn't found in entity model.`, true);
                return;
            }
            const internal = {
                ownerColumns: [],
                relatedColumns: [],
                ownerTable,
                relatedTable,
            };
            if (rows[0].DELETE_RULE !== "NO ACTION") {
                internal.onDelete = rows[0].DELETE_RULE;
            }
            rows.forEach((row) => {
                internal.ownerColumns.push(row.OWNER_COLUMN_NAME);
                internal.relatedColumns.push(row.CHILD_COLUMN_NAME);
            });
            relationsTemp.push(internal);
        });
        const retVal = OracleDriver.GetRelationsFromRelationTempInfo(relationsTemp, entities, generationOptions);
        return retVal;
    }
    async DisconnectFromServer() {
        if (this.Connection) {
            await this.Connection.close();
        }
    }
    async ConnectToServer(connectionOptions) {
        let config;
        if (connectionOptions.user === String(process.env.ORACLE_UsernameSys)) {
            config = {
                connectString: `${connectionOptions.host}:${connectionOptions.port}/${connectionOptions.databaseNames[0]}`,
                externalAuth: connectionOptions.ssl,
                password: connectionOptions.password,
                privilege: this.Oracle.SYSDBA,
                user: connectionOptions.user,
            };
        }
        else {
            config = {
                connectString: `${connectionOptions.host}:${connectionOptions.port}/${connectionOptions.databaseNames[0]}`,
                externalAuth: connectionOptions.ssl,
                password: connectionOptions.password,
                user: connectionOptions.user,
            };
        }
        const promise = new Promise((resolve, reject) => {
            this.Oracle.getConnection(config, (err, connection) => {
                if (!err) {
                    this.Connection = connection;
                    resolve(true);
                }
                else {
                    TomgUtils.LogError("Error connecting to Oracle Server.", false, err.message);
                    reject(err);
                }
            });
        });
        await promise;
    }
    async CreateDB(dbName) {
        await this.Connection.execute(`CREATE USER ${dbName} IDENTIFIED BY ${String(process.env.ORACLE_Password)}`);
        await this.Connection.execute(`GRANT CONNECT TO ${dbName}`);
    }
    // eslint-disable-next-line class-methods-use-this
    async UseDB() {
        // not supported
    }
    async DropDB(dbName) {
        await this.Connection.execute(`DROP USER ${dbName} CASCADE`);
    }
    async CheckIfDBExists(dbName) {
        const { rows } = await this.Connection.execute(`select count(*) as CNT from dba_users where username='${dbName.toUpperCase()}'`);
        return rows[0][0] > 0 || rows[0].CNT;
    }
    static ReturnDefaultValueFunction(defVal) {
        let defaultVal = defVal === null || defVal === void 0 ? void 0 : defVal.trim();
        if (!defaultVal) {
            return undefined;
        }
        if (defaultVal.endsWith(" ")) {
            defaultVal = defaultVal.slice(0, -1);
        }
        return `() => "${defaultVal}"`;
    }
}
exports.default = OracleDriver;
//# sourceMappingURL=OracleDriver.js.map