import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ProductStatus, ProductCollection, ProductVolume } from '../../enums/product.enum';
import { ObjectId } from 'mongoose';
import { availableAgentSorts, availableProductSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { Optional } from '@nestjs/common';

@InputType()
export class ProductInput {
	@IsNotEmpty()
	@Field(() => ProductCollection)
	productCollection: ProductCollection;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	productName: string;

	@IsNotEmpty()
	@Length(5, 500)
	@Field(() => String)
	productDetail: string;

	@IsNotEmpty()
	@Field(() => Number)
	productPrice: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	productDiscount?: number;

	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Field(() => Int)
	productLeftCount: number;

	@IsNotEmpty()
	@Field(() => ProductVolume)
	productVolume: ProductVolume;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	productSoldCount?: number;

	@IsNotEmpty()
	@Field(() => [String])
	productImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	productDesc?: string;

	memberId?: ObjectId;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class SquaresRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
export class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [ProductCollection], { nullable: true })
	typeList?: ProductCollection[]; //tog'ri

	@IsOptional()
	@Field(() => [ProductVolume], { nullable: true })
	productVolumeList?: ProductVolume[]; //tog'ri

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange; //tog'ri

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange; //tog'ri

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string; //tog'ri

	@Field(() => Boolean, { nullable: true })
	inStock?: boolean; //aniq emas

	@Field(() => Boolean, { nullable: true })
	discounted?: boolean; //50/50

	//Bu sening enumlar asosida guruhlash (FOOD, ANIMAL...)
	@Field(() => [String], { nullable: true })
	mainTypeList?: string[];

	@Field(() => [String], { nullable: true })
	animalList?: string[];
}

@InputType()
export class ProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;
}

@InputType()
export class AgentProductsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: number;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
class ALPISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;
}

@InputType()
export class AllPropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
