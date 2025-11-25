import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';
import { Product } from '../product/product';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class OrderItem {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Int)
	itemQuantity: number;

	@Field(() => Number)
	itemPrice: number;

	@Field(() => String)
	orderId: ObjectId;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Number)
	orderTotal: number;

	@Field(() => Number, { nullable: true })
	orderDelivery?: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => [OrderItem], { nullable: true })
	orderItems?: OrderItem[];

	@Field(() => [Product], { nullable: true })
	productData?: Product[];

	/* from aggregation */

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
