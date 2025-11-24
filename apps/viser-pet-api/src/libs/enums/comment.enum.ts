import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(CommentStatus, {
	name: 'CommentStatus',
});

export enum CommentGroup {
	MEMBER = 'MEMBER',
	BLOGPOST = 'BLOGPOST',
	PRODUCT = 'PRODUCT',
}
registerEnumType(CommentGroup, {
	name: 'CommentGroup',
});
