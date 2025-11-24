import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	BLOGPOST = 'BLOGPOST',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
