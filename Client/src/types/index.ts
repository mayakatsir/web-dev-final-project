export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  recipesCount: number;
}

export interface Recipe {
  id: string;
  authorId: string;
  authorUsername: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  category: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  postedAt: string;
}

export interface Comment {
  id: string;
  recipeId: string;
  authorId: string;
  text: string;
  postedAt: string;
}
