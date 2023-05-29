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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const PostAuthor_1 = require("./PostAuthor");
const PostCategory_1 = require("./PostCategory");
let Post = class Post {
};
__decorate([
    (0, typeorm_1.Column)("int", {
        primary: true,
        name: "id"
    }),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => PostAuthor_1.PostAuthor, PostAuthor => PostAuthor.id),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostAuthor_1.PostAuthor)
], Post.prototype, "postAuthor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => PostCategory_1.PostCategory, PostCategory => PostCategory.id),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostCategory_1.PostCategory)
], Post.prototype, "postCategory", void 0);
Post = __decorate([
    (0, typeorm_1.Index)("travel_travelplanextra_travel_plan_id_extra_id_f825ca51_uniq", ["postAuthor", "postCategory"], { unique: true }),
    (0, typeorm_1.Entity)("Post")
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map