import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	BLOGPOST = 'BLOGPOST',
	PROPERTY = 'PROPERTY',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
