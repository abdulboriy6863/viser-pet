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

/*IMAGE CONFIGURATION*/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

//auth bolgan member.      //propniId            //hosil bolgan property id ni qabul qilish
export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	//idRefId mavjud bolmasa shu qiymatni oladi
	return {
		$lookup: {
			//localvariable
			from: 'likes', //likees collectionda izledi
			let: {
				//likes ni ichiga kirib shuni ichidan qidirishini aytyappiz (search)
				localLikeRefId: targetRefId, //"$_id" bu shunde degani
				localMemberId: memberId,
				localMyFavorite: true,
			},
			//pipeline
			pipeline: [
				{
					$match: {
						$expr: {
							//aynan nimalarni solishtirishimizni belgilaypamiz
							$and: [{ $eq: ['$likeRefId', '$$localLikeRefId'] }, { $eq: ['$memberId', '$$localMemberId'] }], //ikkalasin teng holatini izla
							//memberId ni localLikeRefId ga teng bolgan holatin izla
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',
					},
				},
			],
			as: 'meLiked',
		},
	};
};

export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData',
	},
};

export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData',
	},
};

export const lookupFavorite = {
	$lookup: {
		from: 'members',
		localField: 'favoriteProduct.memberId',
		foreignField: '_id',
		as: 'favoriteProduct.memberData',
	},
};

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProduct.memberId',
		foreignField: '_id',
		as: 'visitedProduct.memberData',
	},
};
