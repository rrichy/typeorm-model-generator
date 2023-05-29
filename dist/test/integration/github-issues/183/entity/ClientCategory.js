"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCategory = void 0;
const typeorm_1 = require("typeorm");
const Client_1 = require("./Client");
let ClientCategory = class ClientCategory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ClientCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Client_1.Client, (client) => client.clientCategories),
    __metadata("design:type", Array)
], ClientCategory.prototype, "clients", void 0);
ClientCategory = __decorate([
    (0, typeorm_1.Entity)("ClientCategory")
], ClientCategory);
exports.ClientCategory = ClientCategory;
//# sourceMappingURL=ClientCategory.js.map