import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { userModel } from '../models/user';
import { postModel } from '../models/post';
import { commentModel } from '../models/comment';
import * as askAIbl from '../bl/askAI';

let app: Express;

let testUser = {
    username: 'aiTestUser',
    email: 'ai@test.com',
    password: 'testpassword',
    name: '',
    avatarUrl: '',
    bio: '',
    token: '',
    _id: '',
};

let postId = '';

beforeAll(async () => {
    jest.spyOn(askAIbl, 'askAI').mockResolvedValue('Mocked AI answer');
    jest.spyOn(askAIbl, 'recommendRecipe').mockResolvedValue('Mocked recipe recommendation');
    jest.spyOn(askAIbl, 'recommendFromFavorites').mockResolvedValue('Mocked favorites recommendation');

    app = await global.initTestServer();

    await userModel.deleteMany();
    await postModel.deleteMany();
    await commentModel.deleteMany();

    const registerBody = (await request(app).post('/auth/register').send(testUser)).body;
    testUser._id = registerBody.user._id;
    testUser.token = (
        await request(app).post('/auth/login').send({ username: testUser.username, password: testUser.password })
    ).body.token;

    postId = (
        await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ title: 'AI test post', description: 'Some description', sender: testUser._id })
    ).body._id;
});

afterAll(async () => {
    jest.restoreAllMocks();
    mongoose.connection.close();
    await global.closeTestServer();
});

describe('Ask-AI Tests', () => {
    test('GET /ask-ai - returns an answer for a valid prompt', async () => {
        const { statusCode, body: { answer } } = await request(app)
            .get('/ask-ai')
            .query({ prompt: 'What is a recipe for pasta?' })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(answer).toBeDefined();
    });

    test('GET /ask-ai - fails without prompt param', async () => {
        const { statusCode, body: { message } } = await request(app)
            .get('/ask-ai')
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe('`prompt` query param is missing');
    });

    test('POST /ask-ai/recommend - returns a recipe recommendation', async () => {
        const { statusCode, body: { answer } } = await request(app)
            .post('/ask-ai/recommend')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ ingredients: 'chicken, garlic, lemon' });

        expect(statusCode).toBe(200);
        expect(answer).toBeDefined();
    });

    test('POST /ask-ai/recommend - fails without ingredients param', async () => {
        const { statusCode, body: { message } } = await request(app)
            .post('/ask-ai/recommend')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({});

        expect(statusCode).toBe(400);
        expect(message).toBe('`ingredients` body param is missing');
    });

    test('POST /ask-ai/recommend-from-favorites - returns a recommendation', async () => {
        await request(app)
            .post(`/post/${postId}/like`)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ userId: testUser._id });

        const { statusCode, body: { answer } } = await request(app)
            .post('/ask-ai/recommend-from-favorites')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ userId: testUser._id, mealType: 'dinner' });

        expect(statusCode).toBe(200);
        expect(answer).toBeDefined();
    });

    test('POST /ask-ai/recommend-from-favorites - fails without userId', async () => {
        const { statusCode, body: { message } } = await request(app)
            .post('/ask-ai/recommend-from-favorites')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ mealType: 'dinner' });

        expect(statusCode).toBe(400);
        expect(message).toBe('`userId` body param is missing');
    });

    test('POST /ask-ai/recommend-from-favorites - fails without mealType', async () => {
        const { statusCode, body: { message } } = await request(app)
            .post('/ask-ai/recommend-from-favorites')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ userId: testUser._id });

        expect(statusCode).toBe(400);
        expect(message).toBe('`mealType` body param is missing');
    });

    test('POST /ask-ai/recommend-from-favorites - fails when user has no liked posts', async () => {
        await request(app)
            .delete(`/post/${postId}/like`)
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ userId: testUser._id });

        const { statusCode, body: { message } } = await request(app)
            .post('/ask-ai/recommend-from-favorites')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send({ userId: testUser._id, mealType: 'dinner' });

        expect(statusCode).toBe(400);
        expect(message).toBe('User has no liked posts to base a recommendation on');
    });
});
