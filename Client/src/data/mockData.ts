import type { User, Recipe } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'Sarah Mitchell',
  username: 'sarahcooks',
  bio: 'Home cook & food enthusiast. Sharing simple, delicious recipes from my kitchen to yours. 🍳',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
  joinedDate: 'March 2024',
  followersCount: 1284,
  followingCount: 342,
  recipesCount: 24,
};

export const userRecipes: Recipe[] = [
  {
    id: 'r1',
    authorId: 'u1',
    title: 'Creamy Tuscan Garlic Pasta',
    description:
      'A rich and indulgent pasta loaded with sun-dried tomatoes, spinach, and a creamy parmesan sauce.',
    category: 'Pasta',
    cookingTime: 25,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop',
    likesCount: 312,
    postedAt: '2025-03-10',
  },
  {
    id: 'r2',
    authorId: 'u1',
    title: 'Honey Garlic Salmon',
    description:
      'Perfectly pan-seared salmon glazed with a sweet honey garlic sauce. Ready in under 20 minutes.',
    category: 'Seafood',
    cookingTime: 20,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    likesCount: 487,
    postedAt: '2025-03-01',
  },
  {
    id: 'r3',
    authorId: 'u1',
    title: 'Classic Beef Bourguignon',
    description:
      'A French comfort classic — slow-braised beef with mushrooms, pearl onions, and a rich red wine sauce.',
    category: 'Beef',
    cookingTime: 180,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    likesCount: 210,
    postedAt: '2025-02-20',
  },
  {
    id: 'r4',
    authorId: 'u1',
    title: 'Lemon Blueberry Pancakes',
    description:
      'Fluffy pancakes bursting with fresh blueberries and a hint of zesty lemon. The perfect weekend breakfast.',
    category: 'Breakfast',
    cookingTime: 30,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    likesCount: 654,
    postedAt: '2025-02-14',
  },
  {
    id: 'r5',
    authorId: 'u1',
    title: 'Thai Green Curry',
    description:
      'Aromatic and spicy Thai green curry with coconut milk, vegetables, and your choice of protein.',
    category: 'Asian',
    cookingTime: 40,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    likesCount: 398,
    postedAt: '2025-02-05',
  },
  {
    id: 'r6',
    authorId: 'u1',
    title: 'Chocolate Lava Cake',
    description:
      'Decadent individual chocolate cakes with a warm molten center. Impress anyone with this restaurant-worthy dessert.',
    category: 'Dessert',
    cookingTime: 20,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    likesCount: 729,
    postedAt: '2025-01-28',
  },
];
