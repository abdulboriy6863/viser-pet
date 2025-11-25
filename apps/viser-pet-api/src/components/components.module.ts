import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';
import { ViewModule } from './view/view.module';
import { BlogPostModule } from './blog-post/blog-post.module';

@Module({
	imports: [
		MemberModule,
		ProductModule,
		AuthModule,
		LikeModule,
		FollowModule,
		OrderModule,
		CommentModule,
		ViewModule,
		BlogPostModule,
	],
	providers: [],
})
export class ComponentsModule {}
