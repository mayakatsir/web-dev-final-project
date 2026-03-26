import { InferSchemaType, Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  sender: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  cookingTime: {
    type: Number,
    default: 30,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  postedAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

export const postModel = model('post', postSchema);
export type Post = InferSchemaType<typeof postSchema>;
