import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Order } from '../../libs/dto/order/order';
import { ObjectId } from 'mongoose';
import { CreateOrderInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Member } from '../../libs/dto/member/member';
import { OrderInquiry } from '../../libs/dto/order/order.inquiry';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	createOrder(@Args('input') input: CreateOrderInput, @AuthMember() authMember: Member): Promise<Order> {
		console.log('Mutation: createOrder');
		return this.orderService.createOrder(authMember, input.items);
	}

	@UseGuards(AuthGuard)
	@Query(() => [Order]) // <-- bir nechta Order qaytishini bildiradi
	getMyOrder(@Args('inquiry') inquiry: OrderInquiry, @AuthMember() authMember: Member): Promise<Order[]> {
		return this.orderService.getMyOrder(authMember, inquiry);
	}
}
