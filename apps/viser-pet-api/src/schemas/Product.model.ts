import { Schema } from 'mongoose';
import { ProductCollection, ProductStatus, ProductVolumeEnum } from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productCollection: {
			type: String,
			enum: ProductCollection,
			required: true,
		},

		propertyStatus: {
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
			required: true,
		},

		productLeftCount: {
			type: Number,
			required: true,
		},

		productSoldCount: {
			type: Number,
			required: true,
		},

		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

		productVolume: {
			value: Number,
			unit: String,
			sizeCategory: ProductVolumeEnum,
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

		constructedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'products' },
);

ProductSchema.index({ productCollection: 1, productName: 1, productPrice: 1 }, { unique: true });

export default ProductSchema;
