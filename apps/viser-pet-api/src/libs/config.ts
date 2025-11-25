import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];

// export const availableOptions = ['propertyBarter', 'propertyRent'];

export const availableProductSorts = [
	'createdAt',
	'updatedAt',
	'productLikes',
	'productViews',
	'productRank',
	'productPrice',
	'productSoldCount',
];

export const availableOrderSorts = ['createdAt', 'updatedAt', 'orderTotal'];

export const availableBlogPostSorts = ['createdAt', 'updatedAt', 'blogPostLikes', 'blogPostViews'];

export const availableCommentSorts = ['createdAt', 'updatedAt'];

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
