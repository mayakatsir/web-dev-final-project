import { FilterQuery } from 'mongoose';
import { Post, postModel } from '../models/post';

class PostRepository {
  async createPost(data: {
    title: string;
    sender: string;
    description?: string;
    category?: string;
    cookingTime?: number;
    difficulty?: string;
    imageUrl?: string;
  }) {
    return await postModel.create({
      ...data,
      postedAt: new Date().toISOString(),
    });
  }

  async getPostById(id: string) {
    return await postModel.findById(id).select('-__v');
  }

  async getAllPosts(query: Record<string, string | undefined>) {
    const filters: FilterQuery<Post> = {};

    if ('sender' in query) {
      filters.sender = query.sender;
    }

    return await postModel.find(filters).select('-__v');
  }

  async updatePost(id: string, updates: Partial<Post>) {
    await postModel.findByIdAndUpdate(id, updates);
  }

  async deletePostById(postId: string) {
    await postModel.deleteOne({ _id: postId });
  }
}

export default new PostRepository();
