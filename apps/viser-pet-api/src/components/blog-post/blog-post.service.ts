import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BlogPost } from '../../libs/dto/blog-post/blog-post';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { BlogPostInput } from '../../libs/dto/blog-post/blog-post.input';
import { Message } from '../../libs/enums/common.enum';
import { BlogPostStatus } from '../../libs/enums/blog-post.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { StatisticModifier, T } from '../../libs/types/common';

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
