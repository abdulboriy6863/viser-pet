import { Module } from '@nestjs/common';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogPostService } from './blog-post.service';
import { MongooseModule } from '@nestjs/mongoose';
import BlogPostSchema from '../../schemas/BlogPost.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'BlogPost',
				schema: BlogPostSchema,
			},
		]),
		AuthModule,
		MemberModule,
		ViewModule,
		LikeModule,
	],
	providers: [BlogPostResolver, BlogPostService],
	exports: [BlogPostService],
})
export class BlogPostModule {}
