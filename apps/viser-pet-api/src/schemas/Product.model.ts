import { Schema } from 'mongoose';
import { ProductCollection, ProductStatus, ProductVolume } from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productCollection: {
			type: String,
			enum: ProductCollection,
			required: true,
		},

		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.ACTIVE,
		},

		productName: {
			type: String,
			required: true,
		},

		productDetail: {
			type: String,
			required: true,
		},

		productPrice: {
			type: Number,
			required: true,
		},

		productDiscount: {
			type: Number,
			default: 0,
		},

		productLeftCount: {
			type: Number,
			required: true,
		},

		productVolume: {
			type: String,
			enum: ProductVolume,
			default: ProductVolume.MEDIUM,
		},

		productSoldCount: {
			type: Number,
			default: 0,
		},

		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

		productComments: {
			type: Number,
			default: 0,
		},

		productRank: {
			type: Number,
			default: 0,
		},

		productImages: {
			type: [String],
			required: true,
		},

		productDesc: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'products' },
);

ProductSchema.index({ productCollection: 1, productName: 1, ProductVolumeEnum: 1, productVolume: 1 }, { unique: true });

export default ProductSchema;
