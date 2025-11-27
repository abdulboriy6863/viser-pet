import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../../libs/dto/product/product';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { ProductInput } from '../../libs/dto/product/product.input';
import { Message } from '../../libs/enums/common.enum';

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
}
