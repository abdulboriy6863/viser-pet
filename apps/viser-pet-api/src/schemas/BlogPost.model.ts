import { Schema } from 'mongoose';
import { BlogPostCategory, BlogPostStatus } from '../libs/enums/blog-post.enum';

const BlogPostSchema = new Schema(
	{
		blogPostCategory: {
			type: String,
			enum: BlogPostCategory,
			required: true,
		},

		blogPostStatus: {
			type: String,
			enum: BlogPostStatus,
			default: BlogPostStatus.ACTIVE,
		},

		blogPostTitle: {
			type: String,
			required: true,
		},

		blogPostContent: {
			type: String,
			required: true,
		},

		blogPostImage: {
			type: String,
		},

		blogPostLikes: {
			type: Number,
			default: 0,
		},

		blogPostRank: {
			type: Number,
			default: 0,
		},

		blogPostViews: {
			type: Number,
			default: 0,
		},

		blogPostComments: {
			type: Number,
			default: 0,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'blogPosts' },
);

export default BlogPostSchema;
