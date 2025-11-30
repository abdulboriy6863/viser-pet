import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { LikeService } from '../like/like.service';
import { Order, OrderItem } from '../../libs/dto/order/order';
import { Product } from '../../libs/dto/product/product';
import { Member } from '../../libs/dto/member/member';
import { OrderItemInput } from '../../libs/dto/order/order.input';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		@InjectModel('OrderItem') private readonly orderItemModel: Model<OrderItem>,
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private authService: AuthService,
		private likeService: LikeService,
	) {}

	public async createOrder(member: Member, input: OrderItemInput[]): Promise<Order> {
		const memberId = shapeIntoMongoObjectId(member._id);
		const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
			return accumulator + item.itemPrice * item.itemQuantity;
		}, 0);
		const delivery = amount < 100 ? 5 : 0;
		console.log('values:', amount, delivery);

		try {
			const newOrder: Order = await this.orderModel.create({
				orderTotal: amount + delivery,
				orderDelivery: delivery,

				memberId: memberId,
			});

			const orderId = newOrder._id;
			console.log('orderId::', newOrder._id);
			await this.recordOrderItem(orderId, input);
			//TODO: create order items

			return newOrder;
		} catch (err) {
			console.log('Error, Property Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	private async recordOrderItem(orderId: ObjectId, input: OrderItemInput[]): Promise<void> {
		const promisedList = input.map(async (item: OrderItemInput) => {
			item.orderId = orderId;
			item.productId = shapeIntoMongoObjectId(item.productId);
			await this.orderItemModel.create(item);

			await this.productModel.findOneAndUpdate(
				{ _id: item.productId },
				{
					$inc: { soldCount: item.itemQuantity || 1 },
				},
			);

			return 'Inserted';
		});

		console.log('promisedList::', promisedList);
		const orderItemsState = await Promise.all(promisedList);
		console.log('orderItemsState::', orderItemsState);
	}
}
