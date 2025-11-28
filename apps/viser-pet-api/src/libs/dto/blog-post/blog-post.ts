import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogPostCategory, BlogPostStatus } from '../../enums/blog-post.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class BlogPost {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => BlogPostCategory)
	blogPostCategory: BlogPostCategory;

	@Field(() => BlogPostStatus)
	blogPostStatus: BlogPostStatus;

	@Field(() => String)
	blogPostTitle: string;

	@Field(() => String)
	blogPostContent: string;

	@Field(() => String, { nullable: true })
	blogPostImage?: string;

	@Field(() => Int)
	blogPostViews: number;

	@Field(() => Int)
	blogPostLikes: number;

	@Field(() => Int)
	blogPostComments: number;

	@Field(() => Int)
	blogPostRank: number;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	/* from agregation */
	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class BlogPosts {
	@Field(() => [BlogPost])
	list: BlogPost[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
