import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, Products } from '../../libs/dto/product/product';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import {
	AgentProductsInquiry,
	OrdinaryInquiry,
	ProductInput,
	ProductsInquiry,
} from '../../libs/dto/product/product.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductCollection, ProductStatus } from '../../libs/enums/product.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import * as moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
	) {}

	public async createProduct(input: ProductInput): Promise<Product> {
		try {
			const result = await this.productModel.create(input);
			// increase memberProducts
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProducts',
				modifier: 1,
			});
			console.log('createProduct:', result);
			return result;
		} catch (err) {
			console.log('Error, Product Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProduct(memberId: ObjectId, productId: ObjectId): Promise<Product> {
		const search: T = {
			_id: productId,
			productStatus: ProductStatus.ACTIVE,
		};

		const targetProduct: Product = await this.productModel.findOne(search).lean().exec();
		if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: productId, viewGroup: ViewGroup.PRODUCT };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.productStatsEditor({ _id: productId, targetKey: 'productViews', modifier: 1 });
				targetProduct.productViews++;
			}

			//meliked
			const likeInput = { memberId: memberId, likeRefId: productId, likeGroup: LikeGroup.PRODUCT };
			targetProduct.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
		return targetProduct;
	}

	public async updateProduct(memberId: ObjectId, input: ProductUpdate): Promise<Product> {
		let { productStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			productStatus: ProductStatus.ACTIVE,
		};

		if (productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
		else if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.productModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberProperties',
				modifier: -1,
			});
		}

		return result;
	}

	public async getProducts(memberId: ObjectId, input: ProductsInquiry): Promise<Products> {
		const match: T = { productStatus: ProductStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							//meliked
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	private shapeMatchQuery(match: any, input: ProductsInquiry): void {
		const {
			memberId,
			typeList,
			productVolumeList,
			periodsRange,
			pricesRange,
			text,
			inStock,
			discounted,
			mainTypeList,
			animalList,
		} = input.search;

		// memberId bo‘lsa filter
		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);

		// productVolume bo‘yicha filter
		if (productVolumeList && productVolumeList.length) {
			match.productVolume = { $in: productVolumeList };
		}

		// typeList bo‘yicha filter (enum ProductCollection)
		if (typeList && typeList.length) {
			match.productCollection = { $in: typeList };
		}

		if (mainTypeList && mainTypeList.length) {
			// Agar mainTypeList ichida 'ANIMAL' bo'lsa, barcha animal turlarini qo'shadi
			let collectionsToInclude: string[] = [];

			mainTypeList.forEach((type) => {
				if (type.toUpperCase() === 'ANIMAL') {
					// Hammasi ANIMAL_ bilan boshlanganlarini qo'sh
					collectionsToInclude.push(...Object.values(ProductCollection).filter((val) => val.startsWith('ANIMAL_')));
				} else {
					// Boshqa main type turlari (FOOD, ACCESSORY, MEDICINE va h.k.)
					collectionsToInclude.push(
						...Object.values(ProductCollection).filter((val) => val.startsWith(type.toUpperCase() + '_')),
					);
				}
			});

			match.productCollection = { $in: collectionsToInclude };
		}

		// Agar faqat animalList ishlatilsa
		if (animalList && animalList.length) {
			let animalCollections: string[] = [];

			if (animalList.includes('ANIMAL')) {
				// Hammasi ANIMAL_ bilan boshlanganlari
				animalCollections.push(...Object.values(ProductCollection).filter((val) => val.startsWith('ANIMAL_')));
			} else {
				// Faqat tanlangan turlar (DOG, CAT, FISH, BIRD, OTHER)
				animalCollections.push(
					...Object.values(ProductCollection).filter((val) =>
						animalList.some((type) => val === `ANIMAL_${type.toUpperCase()}`),
					),
				);
			}

			match.productCollection = { $in: animalCollections };
		}

		// // mainTypeList bo‘yicha filter (FOOD, ANIMAL, ACCESSORY...)
		// if (mainTypeList && mainTypeList.length) {
		// 	match.productCollection = {
		// 		$in: mainTypeList.map((type) => new RegExp(`^${type}`)), // prefix bo‘yicha filter
		// 	};
		// }

		// // animalList bo‘yicha filter (ANIMAL_DOG, ANIMAL_CAT...)
		// if (animalList && animalList.length) {
		// 	match.productCollection = {
		// 		$in: animalList.map((type) => new RegExp(`^ANIMAL_${type.toUpperCase()}`)),
		// 	};
		// }

		// price range
		if (pricesRange) {
			match.productPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		}

		// periods range (yaratilgan vaqt)
		if (periodsRange) {
			match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };
		}

		// text search
		if (text) {
			match.productName = { $regex: new RegExp(text, 'i') };
		}

		// stokdagi mahsulotlar
		if (inStock) {
			match.productLeftCount = { $gt: 0 };
		}

		// chegirmadagi mahsulotlar
		if (discounted) {
			match.productDiscount = { $gt: 0 };
		}
	}

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
		return await this.likeService.getFavoriteProducts(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
		return await this.viewService.getVisitedProducts(memberId, input);
	}

	public async getAgentProducts(memberId: ObjectId, input: AgentProductsInquiry): Promise<Products> {
		const { productStatus } = input.search;
		if (productStatus === ProductStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			productStatus: productStatus ?? { $ne: ProductStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async likeTargetProduct(memberId: ObjectId, likeRefId: ObjectId): Promise<Product> {
		const target: Product = await this.productModel
			.findOne({ _id: likeRefId, productStatus: ProductStatus.ACTIVE })
			.exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.PRODUCT,
		};

		//LIKE TOGGLE via like modules
		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.productStatsEditor({ _id: likeRefId, targetKey: 'productLikes', modifier: modifier });

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async productStatsEditor(input: StatisticModifier): Promise<Product> {
		const { _id, targetKey, modifier } = input;
		return await this.productModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}
