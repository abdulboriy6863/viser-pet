import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BlogPost, BlogPosts } from '../../libs/dto/blog-post/blog-post';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { AllBlogPostsInquiry, BlogPostInput, BlogPostsInquiry } from '../../libs/dto/blog-post/blog-post.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { BlogPostStatus } from '../../libs/enums/blog-post.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { BlogPostUpdate } from '../../libs/dto/blog-post/blog-post.update';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';

@Injectable()
export class BlogPostService {
	constructor(
		@InjectModel('BlogPost') private readonly blogPostModel: Model<BlogPost>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
	) {}

	public async createBlogPost(memberId: ObjectId, input: BlogPostInput): Promise<BlogPost> {
		input.memberId = memberId; //imputni memberId sini kirib kelgan memberId ga teglashtiryapmiz
		try {
			const result = await this.blogPostModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberBlogPosts',
				modifier: 1,
			});
			//memberBlogPosts statistikasini bittaga oshiradi

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getBlogPost(memberId: ObjectId, blogPostId: ObjectId): Promise<BlogPost> {
		const search: T = {
			_id: blogPostId,
			blogPostStatus: BlogPostStatus.ACTIVE,
		};
		const targetBlogPost: BlogPost = await this.blogPostModel.findOne(search).lean().exec();
		if (!targetBlogPost) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: blogPostId, viewGroup: ViewGroup.BLOGPOST };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.blogPostStatsEditor({ _id: blogPostId, targetKey: 'blogPostViews', modifier: 1 });
				targetBlogPost.blogPostViews++;
			}
			//meLiked

			const likeInput = { memberId: memberId, likeRefId: blogPostId, likeGroup: LikeGroup.BLOGPOST };
			targetBlogPost.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}
		targetBlogPost.memberData = await this.memberService.getMember(null, targetBlogPost.memberId);
		return targetBlogPost;
	}

	public async updateBlogPost(memberId: ObjectId, input: BlogPostUpdate): Promise<BlogPost> {
		const { _id, blogPostStatus } = input;

		const result = await this.blogPostModel
			.findOneAndUpdate({ _id: _id, memberId: memberId, blogPostStatus: BlogPostStatus.ACTIVE }, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (blogPostStatus === BlogPostStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberBlogPosts',
				modifier: -1,
			});
		}

		return result;
	}

	public async getBlogPosts(memberId: ObjectId, input: BlogPostsInquiry): Promise<BlogPosts> {
		const { blogPostCategory, text } = input.search;
		const match: T = { blogPostStatus: BlogPostStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (blogPostCategory) match.blogPostCategory = blogPostCategory;
		if (text) match.blogPostTitle = { $regex: new RegExp(text, 'i') };
		if (input.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}
		console.log('match:', match);

		const result = await this.blogPostModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },

							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async likeTargetBlogPost(memberId: ObjectId, likeRefId: ObjectId): Promise<BlogPost> {
		const target: BlogPost = await this.blogPostModel
			.findOne({ _id: likeRefId, blogPostStatus: BlogPostStatus.ACTIVE })
			.exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.BLOGPOST,
		};

		//LIKE TOGGLE via like modules
		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.blogPostStatsEditor({
			_id: likeRefId,
			targetKey: 'blogPostLikes',
			modifier: modifier,
		});

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	/* ADMIN */

	public async getAllBlogPostsByAdmin(input: AllBlogPostsInquiry): Promise<BlogPosts> {
		const { blogPostStatus, blogPostCategory } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (blogPostStatus) match.blogPostStatus = blogPostStatus;
		if (blogPostCategory) match.blogPostCategory = blogPostCategory;

		const result = await this.blogPostModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateBlogPostByAdmin(input: BlogPostUpdate): Promise<BlogPost> {
		const { _id, blogPostStatus } = input;

		const result = await this.blogPostModel
			.findOneAndUpdate({ _id: _id, blogPostStatus: BlogPostStatus.ACTIVE }, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (blogPostStatus === BlogPostStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberArticles',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeBlogPostByAdmin(blogPostId: ObjectId): Promise<BlogPost> {
		const search: T = { _id: blogPostId, blogPostStatus: BlogPostStatus.DELETE };
		const result = await this.blogPostModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async blogPostStatsEditor(input: StatisticModifier): Promise<BlogPost> {
		const { _id, targetKey, modifier } = input;
		return await this.blogPostModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}
