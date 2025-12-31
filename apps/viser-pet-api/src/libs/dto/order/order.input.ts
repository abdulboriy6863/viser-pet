import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
export class OrderItemInput {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	itemQuantity: number;

	@IsNotEmpty()
	@Field(() => Number)
	itemPrice: number;

	@IsNotEmpty()
	@Field(() => String)
	productId: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	orderId?: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;
}

@InputType()
export class CreateOrderInput {
	@Field(() => [OrderItemInput])
	items: OrderItemInput[]; // Buyurtmadagi barcha mahsulotlar
	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;
}

@InputType()
export class OrderInput {
	@IsNotEmpty()
	@Field(() => [OrderItemInput])
	orderItems: OrderItemInput[];

	@IsOptional()
	@Field(() => Number, { nullable: true })
	orderDelivery?: number;

	memberId?: ObjectId;
}
