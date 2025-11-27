import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { Products } from '../../libs/dto/product/product';
import { lookupFavorite } from '../../libs/config';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly LikeModel: Model<Like>) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.LikeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.LikeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.LikeModel.create(input);
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(`- Like modifier ${modifier}`);
		return modifier;
	}

	public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.LikeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteProducts(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PRODUCT, memberId: memberId }; //likes collectionida like bosgan propertylarimizi izlayapmiz

		const data: T = await this.LikeModel.aggregate([
			{ $match: match },
			{ $sort: { updatedAt: -1 } }, //eng ohirgi qoygan likedan olib beradi
			{
				$lookup: {
					from: 'products',
					localField: 'likeRefId',
					foreignField: '_id',
					as: 'favoriteProduct',
				},
			},
			{ $unwind: '$favoriteProduct' },
			{
				$facet: {
					list: [
						{ $skip: (page - 1) * limit },
						{ $limit: limit },
						lookupFavorite,
						{ $unwind: '$favoriteProduct.memberData' },
					],
					metaCounter: [{ $count: 'total' }],
				},
			},
		]).exec();
		const result: Products = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteProduct);
		return result;
	}
}
