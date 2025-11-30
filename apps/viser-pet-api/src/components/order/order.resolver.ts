import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Order } from '../../libs/dto/order/order';
import { ObjectId } from 'mongoose';
import { CreateOrderInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Member } from '../../libs/dto/member/member';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	createOrder(@Args('input') input: CreateOrderInput, @AuthMember() authMember: Member): Promise<Order> {
		console.log('Mutation: createOrder');
		return this.orderService.createOrder(authMember, input.items);
	}
}
