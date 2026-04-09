import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    likedPosts: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const userModel = model('user', userSchema);
export type User = InferSchemaType<typeof userSchema>;
