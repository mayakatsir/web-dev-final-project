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
  title: string;
  description: string;
  category: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  likesCount: number;
  postedAt: string;
}
