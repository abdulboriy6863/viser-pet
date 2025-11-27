import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../guards/roles.guard';
import { Product } from '../../libs/dto/product/product';
import { AuthMember } from '../decorators/authMember.decorator';
import { ProductInput } from '../../libs/dto/product/product.input';
import { ObjectId } from 'mongoose';

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Product)
	public async createProduct(
		@Args('input') input: ProductInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Product> {
		console.log('Mutation: createProduct');
		input.memberId = memberId;

		return await this.productService.createProduct(input);
	}
}
