"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTomgConnectionOptions = exports.createModelsInDb = exports.getEnabledDbDrivers = exports.compileTsFiles = exports.createOracleDBModels = exports.createMariaDBModels = exports.createMysqlModels = exports.createSQLiteModels = exports.createPostgresModels = exports.createMSSQLModels = exports.getGenerationOptions = void 0;
const typeorm_1 = require("typeorm");
const ts = require("typescript");
const yn = require("yn");
const path = require("path");
const IGenerationOptions_1 = require("../../src/IGenerationOptions");
const MssqlDriver_1 = require("../../src/drivers/MssqlDriver");
const MariaDbDriver_1 = require("../../src/drivers/MariaDbDriver");
const PostgresDriver_1 = require("../../src/drivers/PostgresDriver");
const OracleDriver_1 = require("../../src/drivers/OracleDriver");
const MysqlDriver_1 = require("../../src/drivers/MysqlDriver");
const Utils_1 = require("../../src/Utils");
function getGenerationOptions(resultsPath) {
    const retVal = (0, IGenerationOptions_1.getDefaultGenerationOptions)();
    retVal.resultsPath = resultsPath;
    return retVal;
}
exports.getGenerationOptions = getGenerationOptions;
async function createMSSQLModels(filesOrgPath) {
    const driver = new MssqlDriver_1.default();
    const connectionOptions = getTomgConnectionOptions("mssql");
    await driver.ConnectToServer(connectionOptions);
    connectionOptions.databaseNames = [String(process.env.MSSQL_Database)];
    if (await driver.CheckIfDBExists(String(process.env.MSSQL_Database))) {
        await driver.DropDB(String(process.env.MSSQL_Database));
    }
    await driver.CreateDB(String(process.env.MSSQL_Database));
    await driver.DisconnectFromServer();
    const connOpt = {
        database: String(process.env.MSSQL_Database),
        host: String(process.env.MSSQL_Host),
        password: String(process.env.MSSQL_Password),
        type: "mssql",
        username: String(process.env.MSSQL_Username),
        port: Number(process.env.MSSQL_Port),
        dropSchema: true,
        synchronize: false,
        entities: [path.resolve(filesOrgPath, "*.ts")],
        name: "mssql"
    };
    const schemas = "dbo,sch1,sch2";
    const conn = await (0, typeorm_1.createConnection)(connOpt);
    const queryRunner = conn.createQueryRunner();
    await Promise.all(schemas.split(",").map(sch => queryRunner.createSchema(sch, true)));
    await conn.synchronize();
    if (conn.isConnected) {
        await conn.close();
    }
    return connectionOptions;
}
exports.createMSSQLModels = createMSSQLModels;
async function createPostgresModels(filesOrgPath) {
    const driver = new PostgresDriver_1.default();
    const connectionOptions = getTomgConnectionOptions("postgres");
    await driver.ConnectToServer(connectionOptions);
    connectionOptions.databaseNames = [String(process.env.POSTGRES_Database)];
    if (await driver.CheckIfDBExists(String(process.env.POSTGRES_Database))) {
        await driver.DropDB(String(process.env.POSTGRES_Database));
    }
    await driver.CreateDB(String(process.env.POSTGRES_Database));
    await driver.DisconnectFromServer();
    const connOpt = {
        database: String(process.env.POSTGRES_Database),
        host: String(process.env.POSTGRES_Host),
        password: String(process.env.POSTGRES_Password),
        type: "postgres",
        username: String(process.env.POSTGRES_Username),
        port: Number(process.env.POSTGRES_Port),
        dropSchema: true,
        synchronize: false,
        entities: [path.resolve(filesOrgPath, "*.ts")],
        name: "postgres"
    };
    const schemas = "public,sch1,sch2";
    const conn = await (0, typeorm_1.createConnection)(connOpt);
    const queryRunner = conn.createQueryRunner();
    await Promise.all(schemas.split(",").map(sch => queryRunner.createSchema(sch, true)));
    await conn.synchronize();
    if (conn.isConnected) {
        await conn.close();
    }
    return connectionOptions;
}
exports.createPostgresModels = createPostgresModels;
async function createSQLiteModels(filesOrgPath) {
    const connectionOptions = getTomgConnectionOptions("sqlite");
    const connOpt = {
        database: String(process.env.SQLITE_Database),
        type: "sqlite",
        dropSchema: true,
        synchronize: false,
        entities: [path.resolve(filesOrgPath, "*.ts")],
        name: "sqlite"
    };
    const conn = await (0, typeorm_1.createConnection)(connOpt);
    await conn.synchronize();
    if (conn.isConnected) {
        await conn.close();
    }
    return connectionOptions;
}
exports.createSQLiteModels = createSQLiteModels;
async function createMysqlModels(filesOrgPath) {
    const driver = new MysqlDriver_1.default();
    const connectionOptions = getTomgConnectionOptions("mysql");
    await driver.ConnectToServer(connectionOptions);
    if (await driver.CheckIfDBExists(String(process.env.MYSQL_Database))) {
        await driver.DropDB(String(process.env.MYSQL_Database));
    }
    await driver.CreateDB(String(process.env.MYSQL_Database));
    await driver.DisconnectFromServer();
    const connOpt = {
        database: String(process.env.MYSQL_Database),
        host: String(process.env.MYSQL_Host),
        password: String(process.env.MYSQL_Password),
        type: "mysql",
        username: String(process.env.MYSQL_Username),
        port: Number(process.env.MYSQL_Port),
        dropSchema: true,
        synchronize: true,
        entities: [path.resolve(filesOrgPath, "*.ts")],
        name: "mysql"
    };
    const conn = await (0, typeorm_1.createConnection)(connOpt);
    if (conn.isConnected) {
        await conn.close();
    }
    return connectionOptions;
}
exports.createMysqlModels = createMysqlModels;
async function createMariaDBModels(filesOrgPath) {
    const driver = new MariaDbDriver_1.default();
    const connectionOptions = getTomgConnectionOptions("mariadb");
    await driver.ConnectToServer(connectionOptions);
    if (await driver.CheckIfDBExists(String(process.env.MARIADB_Database))) {
        await driver.DropDB(String(process.env.MARIADB_Database));
    }
    await driver.CreateDB(String(process.env.MARIADB_Database));
    await driver.DisconnectFromServer();
    const connOpt = {
        database: String(process.env.MARIADB_Database),
        host: String(process.env.MARIADB_Host),
        password: String(process.env.MARIADB_Password),
        type: "mariadb",
        username: String(process.env.MARIADB_Username),
        port: Number(process.env.MARIADB_Port),
        dropSchema: true,
        synchronize: true,
        entities: [path.resolve(filesOrgPath, "*.ts")],
        name: "mariadb"
    };
    const conn = await (0, typeorm_1.createConnection)(connOpt);
    if (conn.isConnected) {
        await conn.close();
    }
    return connectionOptions;
}
exports.createMariaDBModels = createMariaDBModels;
async function createOracleDBModels(filesOrgPath) {
    const driver = new OracleDriver_1.default();
    const connectionOptions = getTomgConnectionOptions("oracle");
    await driver.ConnectToServer(connectionOptions);
    connectionOptions.user = String(process.env.ORACLE_Username);
    connectionOptions.password = String(process.env.ORACLE_Password);
    if (await driver.CheckIfDBExists(String(process.env.ORACLE_Username))) {
        await driver.DropDB(String(process.env.ORACLE_Username));
    }
    await driver.CreateDB(String(process.env.ORACLE_Username));
    await driver.DisconnectFromServer();
    const connOpt = {
        database: String(process.env.ORACLE_Database),
        sid: String(process.env.ORACLE_Database),
        host: String(process.env.ORACLE_Host),
        password: String(process.env.ORACLE_Password),
        type: "oracle",
        username: String(process.env.ORACLE_Username),
        port: Number(process.env.ORACLE_Port),
        synchronize: true,
        entities: [path.resolve(filesOrgPath, "*.ts")],
        name: "oracle"
    };
    const conn = await (0, typeorm_1.createConnection)(connOpt);
    if (conn.isConnected) {
        await conn.close();
    }
    return connectionOptions;
}
exports.createOracleDBModels = createOracleDBModels;
function compileTsFiles(fileNames, options) {
    const program = ts.createProgram(fileNames, options);
    const emitResult = program.emit();
    let compiledWithoutErrors = true;
    const preDiagnostics = ts.getPreEmitDiagnostics(program);
    const allDiagnostics = [...preDiagnostics, ...emitResult.diagnostics];
    allDiagnostics.forEach(diagnostic => {
        const lineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        console.log(`${diagnostic.file.fileName} (${lineAndCharacter.line +
            1},${lineAndCharacter.character + 1}): ${message}`);
        compiledWithoutErrors = false;
    });
    return compiledWithoutErrors;
}
exports.compileTsFiles = compileTsFiles;
function getEnabledDbDrivers() {
    const dbDrivers = [];
    if (process.env.SQLITE_Skip === "0") {
        dbDrivers.push("sqlite");
    }
    if (process.env.POSTGRES_Skip === "0") {
        dbDrivers.push("postgres");
    }
    if (process.env.MYSQL_Skip === "0") {
        dbDrivers.push("mysql");
    }
    if (process.env.MARIADB_Skip === "0") {
        dbDrivers.push("mariadb");
    }
    if (process.env.MSSQL_Skip === "0") {
        dbDrivers.push("mssql");
    }
    if (process.env.ORACLE_Skip === "0") {
        dbDrivers.push("oracle");
    }
    return dbDrivers;
}
exports.getEnabledDbDrivers = getEnabledDbDrivers;
function createModelsInDb(dbDriver, filesOrgPathJS) {
    switch (dbDriver) {
        case "sqlite":
            return createSQLiteModels(filesOrgPathJS);
        case "postgres":
            return createPostgresModels(filesOrgPathJS);
        case "mysql":
            return createMysqlModels(filesOrgPathJS);
        case "mariadb":
            return createMariaDBModels(filesOrgPathJS);
        case "mssql":
            return createMSSQLModels(filesOrgPathJS);
        case "oracle":
            return createOracleDBModels(filesOrgPathJS);
        default:
            console.log(`Unknown engine type`);
            throw new Error("Unknown engine type");
    }
}
exports.createModelsInDb = createModelsInDb;
function getTomgConnectionOptions(dbType) {
    switch (dbType) {
        case "mssql":
            return {
                host: String(process.env.MSSQL_Host),
                port: Number(process.env.MSSQL_Port),
                databaseNames: ["master"],
                user: String(process.env.MSSQL_Username),
                password: String(process.env.MSSQL_Password),
                databaseType: "mssql",
                schemaNames: ["dbo", "sch1", "sch2"],
                ssl: yn(process.env.MSSQL_SSL, { default: false }),
                skipTables: [],
                onlyTables: []
            };
        case "mariadb":
            return {
                host: String(process.env.MARIADB_Host),
                port: Number(process.env.MARIADB_Port),
                databaseNames: [String(process.env.MARIADB_Database)],
                user: String(process.env.MARIADB_Username),
                password: String(process.env.MARIADB_Password),
                databaseType: "mariadb",
                schemaNames: ["ignored"],
                ssl: yn(process.env.MARIADB_SSL, { default: false }),
                skipTables: [],
                onlyTables: []
            };
        case "mysql":
            return {
                host: String(process.env.MYSQL_Host),
                port: Number(process.env.MYSQL_Port),
                databaseNames: [String(process.env.MYSQL_Database)],
                user: String(process.env.MYSQL_Username),
                password: String(process.env.MYSQL_Password),
                databaseType: "mysql",
                schemaNames: ["ignored"],
                ssl: yn(process.env.MYSQL_SSL, { default: false }),
                skipTables: [],
                onlyTables: []
            };
        case "oracle":
            return {
                host: String(process.env.ORACLE_Host),
                port: Number(process.env.ORACLE_Port),
                databaseNames: [String(process.env.ORACLE_Database)],
                user: String(process.env.ORACLE_UsernameSys),
                password: String(process.env.ORACLE_PasswordSys),
                databaseType: "oracle",
                schemaNames: [String(process.env.ORACLE_Username)],
                ssl: yn(process.env.ORACLE_SSL, { default: false }),
                skipTables: [],
                onlyTables: []
            };
        case "postgres":
            return {
                host: String(process.env.POSTGRES_Host),
                port: Number(process.env.POSTGRES_Port),
                databaseNames: ["postgres"],
                user: String(process.env.POSTGRES_Username),
                password: String(process.env.POSTGRES_Password),
                databaseType: "postgres",
                schemaNames: ["public", "sch1", "sch2"],
                ssl: yn(process.env.POSTGRES_SSL, { default: false }),
                skipTables: ["spatial_ref_sys"],
                onlyTables: []
            };
        case "sqlite": return {
            host: "",
            port: 0,
            databaseNames: [String(process.env.SQLITE_Database)],
            user: "",
            password: "",
            databaseType: "sqlite",
            schemaNames: [""],
            ssl: false,
            skipTables: [],
            onlyTables: []
        };
        default:
            return (0, Utils_1.assertUnreachable)(dbType);
    }
}
exports.getTomgConnectionOptions = getTomgConnectionOptions;
//# sourceMappingURL=GeneralTestUtils.js.map