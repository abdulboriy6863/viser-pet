import { registerEnumType } from '@nestjs/graphql'; //graphql da ishlatish uchun

export enum MemberType {
	USER = 'USER',
	AGENT = 'AGENT',
	ADMIN = 'ADMIN',
}
registerEnumType(MemberType, {
	name: 'MemberType',
});

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}
registerEnumType(MemberStatus, {
	name: 'MemberStatus',
});

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
	GOOGLE = 'GOOGLE',
}
registerEnumType(MemberAuthType, {
	name: 'MemberAuthType',
});
