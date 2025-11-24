import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	BLOGPOST = 'BLOGPOST',
	PRODUCT = 'PRODUCT',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
