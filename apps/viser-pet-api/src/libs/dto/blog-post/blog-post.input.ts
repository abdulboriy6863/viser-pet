import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { BlogPostCategory, BlogPostStatus } from '../../enums/blog-post.enum';
import { Direction } from '../../enums/common.enum';
import { availableBlogPostSorts } from '../../config';

@InputType()
export class BlogPostInput {
	@IsNotEmpty()
	@Field(() => BlogPostCategory)
	blogPostCategory: BlogPostCategory;

	@IsNotEmpty()
	@Length(3, 50)
	@Field(() => String)
	blogPostTitle: string;

	@IsNotEmpty()
	@Length(3, 250)
	@Field(() => String)
	blogPostContent: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	blogPostImage?: string;

	memberId?: ObjectId;
}

@InputType()
class BAISearch {
	@IsOptional()
	@Field(() => BlogPostCategory, { nullable: true })
	blogPostCategory?: BlogPostCategory;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;
}

@InputType()
export class BlogPostsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableBlogPostSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => BAISearch)
	search: BAISearch;
}

@InputType()
class ABAISearch {
	@IsOptional()
	@Field(() => BlogPostStatus, { nullable: true })
	blogPostStatus?: BlogPostStatus;

	@IsOptional()
	@Field(() => BlogPostCategory, { nullable: true })
	blogPostCategory?: BlogPostCategory;
}

@InputType()
export class AllBlogPostsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableBlogPostSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ABAISearch)
	search: ABAISearch;
}
