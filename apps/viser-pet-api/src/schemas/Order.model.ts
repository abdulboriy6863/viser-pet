import mongoose, { Schema } from 'mongoose';
import { OrderStatus } from '../libs/enums/order.enum';

const orderSchema = new Schema(
	{
		orderTotal: {
			type: Number,
			required: true,
		},

		orderDelivery: {
			type: Number,
			default: 0,
		},

		orderStatus: {
			type: String,
			enum: OrderStatus,
			default: OrderStatus.PAUSE,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true },
);

export default mongoose.model('Order', orderSchema);
