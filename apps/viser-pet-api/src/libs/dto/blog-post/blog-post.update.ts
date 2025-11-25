import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { BlogPostStatus } from '../../enums/blog-post.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class BlogPostUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => BlogPostStatus, { nullable: true })
	articleStatus?: BlogPostStatus;

	@IsOptional()
	@Length(3, 50)
	@Field(() => String, { nullable: true })
	blogPostTitle?: string;

	@IsOptional()
	@Length(3, 250)
	@Field(() => String, { nullable: true })
	blogPostContent?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	blogPostImage?: string;
}
