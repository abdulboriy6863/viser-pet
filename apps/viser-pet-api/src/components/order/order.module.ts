import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema from '../../schemas/Order.model';
import OrderItemSchema from '../../schemas/OrderItem.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import ProductSchema from '../../schemas/Product.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Order', schema: OrderSchema },
			{ name: 'OrderItem', schema: OrderItemSchema },
		]),
		MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),

		AuthModule,
		MemberModule,
		LikeModule,
	],

	providers: [OrderResolver, OrderService],
	exports: [OrderService],
})
export class OrderModule {}
