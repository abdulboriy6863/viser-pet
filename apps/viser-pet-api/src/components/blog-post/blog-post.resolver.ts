import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogPostService } from './blog-post.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { BlogPost, BlogPosts } from '../../libs/dto/blog-post/blog-post';
import { BlogPostInput, BlogPostsInquiry } from '../../libs/dto/blog-post/blog-post.input';
import { AuthMember } from '../decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { BlogPostUpdate } from '../../libs/dto/blog-post/blog-post.update';

@Resolver()
export class BlogPostResolver {
	constructor(private readonly blogPostService: BlogPostService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => BlogPost)
	public async createBlogPost(
		@Args('input') input: BlogPostInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BlogPost> {
		console.log('Mutation: createBlogPost');
		return await this.blogPostService.createBlogPost(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => BlogPost)
	public async getBlogPost(
		@Args('blogPostId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BlogPost> {
		console.log('Query: getBlogPost');
		const blogPostId = shapeIntoMongoObjectId(input);
		return await this.blogPostService.getBlogPost(memberId, blogPostId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => BlogPost)
	public async updateBlogPost(
		@Args('input') input: BlogPostUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BlogPost> {
		console.log('Mutation: updateBlogPost');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.blogPostService.updateBlogPost(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => BlogPosts)
	public async getBlogPosts(
		@Args('input') input: BlogPostsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BlogPosts> {
		console.log('Query: getBlogPosts');
		return await this.blogPostService.getBlogPosts(memberId, input);
	}
}
