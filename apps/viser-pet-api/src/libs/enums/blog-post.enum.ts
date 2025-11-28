import { registerEnumType } from '@nestjs/graphql';

export enum BlogPostCategory {
	FREE = 'FREE',
	RECOMMEND = 'RECOMMEND',
	NEWS = 'NEWS',
	HUMOR = 'HUMOR',
}
registerEnumType(BlogPostCategory, {
	name: 'BlogPostCategory',
});

export enum BlogPostStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(BlogPostStatus, {
	name: 'BlogPostStatus',
});
