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
const PostDetails_1 = require("./PostDetails");
const PostCategory_1 = require("./PostCategory");
const PostAuthor_1 = require("./PostAuthor");
const PostInformation_1 = require("./PostInformation");
const PostImage_1 = require("./PostImage");
const PostMetadata_1 = require("./PostMetadata");
let Post = class Post {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => PostCategory_1.PostCategory, {
        // cascade: true,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostCategory_1.PostCategory)
], Post.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => PostDetails_1.PostDetails, details => details.post, {
        onDelete: 'CASCADE'
        // cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostDetails_1.PostDetails)
], Post.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => PostImage_1.PostImage, image => image.post, {
    // cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostImage_1.PostImage)
], Post.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => PostMetadata_1.PostMetadata, metadata => metadata.post, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], Post.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => PostInformation_1.PostInformation, information => information.post, {
        // cascade: true,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostInformation_1.PostInformation)
], Post.prototype, "information", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => PostAuthor_1.PostAuthor, author => author.post),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", PostAuthor_1.PostAuthor)
], Post.prototype, "author", void 0);
Post = __decorate([
    (0, typeorm_1.Entity)("Post")
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map