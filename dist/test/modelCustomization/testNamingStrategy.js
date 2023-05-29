"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileName = exports.columnName = exports.entityName = exports.relationName = exports.relationIdName = void 0;
const NamingStrategy = require("../../src/NamingStrategy");
function relationIdName(relationId, relation) {
    return `${NamingStrategy.relationIdName(relationId, relation)}`;
}
exports.relationIdName = relationIdName;
function relationName(relation) {
    return `${NamingStrategy.relationName(relation)}_A`;
}
exports.relationName = relationName;
function entityName(oldEntityName) {
    return `${NamingStrategy.entityName(oldEntityName)}_B`;
}
exports.entityName = entityName;
function columnName(oldColumnName) {
    return `${NamingStrategy.columnName(oldColumnName)}_C`;
}
exports.columnName = columnName;
function fileName(oldFileName) {
    return `${NamingStrategy.fileName(oldFileName)}_D`;
}
exports.fileName = fileName;
//# sourceMappingURL=testNamingStrategy.js.map