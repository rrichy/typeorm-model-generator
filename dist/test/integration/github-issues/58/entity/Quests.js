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
exports.Quests = void 0;
const typeorm_1 = require("typeorm");
const Feedextrainfo_1 = require("./Feedextrainfo");
let Quests = class Quests {
};
__decorate([
    (0, typeorm_1.Column)("int", {
        primary: true,
        name: "QuestId"
    }),
    __metadata("design:type", Number)
], Quests.prototype, "questId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => Feedextrainfo_1.Feedextrainfo, feedextrainfo => feedextrainfo.quest),
    __metadata("design:type", Feedextrainfo_1.Feedextrainfo)
], Quests.prototype, "feedextrainfo", void 0);
Quests = __decorate([
    (0, typeorm_1.Entity)("quests")
], Quests);
exports.Quests = Quests;
//# sourceMappingURL=Quests.js.map