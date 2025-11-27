import { registerEnumType } from '@nestjs/graphql';

export enum ProductCollection {
	ACCESSORIES = 'ACCESSORIES',
	DOG = 'DOG',
	CAT = 'CAT',
	FISH = 'FISH',
	BIRD = 'BIRD',
	OTHER = 'OTHER',
}
registerEnumType(ProductCollection, {
	name: 'ProductCollection',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductVolume {
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
}
registerEnumType(ProductVolume, {
	name: 'ProductVolume',
});
