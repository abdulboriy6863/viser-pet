import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/viser-pet-api/src/libs/dto/member/member';
import { Product } from 'apps/viser-pet-api/src/libs/dto/product/product';
import { MemberStatus, MemberType } from 'apps/viser-pet-api/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/viser-pet-api/src/libs/enums/product.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<Product>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.productModel
			.updateMany(
				{
					productStatus: ProductStatus.ACTIVE,
				},
				{ productRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopProducts(): Promise<void> {
		const products: Product[] = await this.productModel
			.find({
				productStatus: ProductStatus.ACTIVE,
				productRank: 0,
			})
			.exec();

		const promisedList = products.map(async (ele: Product) => {
			const { _id, productLikes, productViews } = ele;
			const rank = productLikes * 2 + productViews * 1;
			return await this.productModel.findByIdAndUpdate(_id, { productRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberProducts, memberLikes, memberBlogPosts, memberViews } = ele;
			const rank = memberProducts * 5 + memberBlogPosts * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}
