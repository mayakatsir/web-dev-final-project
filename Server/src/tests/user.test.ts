import request from 'supertest';
import mongoose from 'mongoose';
import { commentModel } from '../models/comment';
import { Express } from 'express';
import { User, userModel } from '../models/user';
import { postModel } from '../models/post';
import UserRepository from '../repositories/userRepository';

let app: Express;
let testUser: User & { _id: string, token: string } = {
    username: 'testuser',
    email: 'test@user.com',
    password: 'testpassword',
    token: '',
    refreshToken: [],
    _id: '',
};

let userId: string;
let postId = '';

beforeAll(async () => {
    app = await global.initTestServer();

    await commentModel.deleteMany();
    await userModel.deleteMany();
    await postModel.deleteMany();

    testUser = (await request(app).post('/auth/register').send(testUser)).body;
    userId = testUser._id;

    const { token, refreshToken } = (
        await request(app)
            .post('/auth/login')
            .send({ username: testUser.username, password: 'testpassword' })
    ).body;
    testUser.token = token;
    testUser.refreshToken = [refreshToken];

    expect(testUser.refreshToken).toBeDefined();
});

afterAll(async () => {
    mongoose.connection.close();
    await global.closeTestServer();
});

describe('Users Tests', () => {
    test('Edit a user', async () => {
        const {
            statusCode,
            body: { message },
        } = await request(app)
            .put(`/user/${userId}`)
            .send({
                email: 'newEmail@gmail.com',
            })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(message).toBe(`Successfully updated user with id: ${userId}`);
    });

    test('Edit a user with an invalid user id', async () => {
        const { statusCode, body: { message } } = await request(app)
            .put(`/user/${userId}1`)
            .send({ email: 'ersafsd' })
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe(`id: ${userId}1 is not valid`);
    });

    test('Get user by their id', async () => {
        const {
            statusCode,
            body: { user: { username, email } },
        } = await request(app)
            .get(`/user/${userId}`)
            .set('Authorization', `Bearer ${testUser.token}`);
            
        expect(statusCode).toBe(200);
        expect(username).toBe(testUser.username);
        expect(email).toBe('newEmail@gmail.com');
    });

    test('Fail to get user with non existant id', async () => {
        const { statusCode, body: { message } } = await request(app)
            .get(`/user/${userId}1`)
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe(`id: ${userId}1 is not valid`);
    });

    test('Get all users', async () => {
        await UserRepository.createUser('Maya', 'andKaren@com.il', 'assignmentPassword')
        
        const {
            statusCode,
            body: {
                users: { length },
            },
        } = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(length).toBe(2);
    });

    test('Delete a user', async () => {
        const { statusCode, body: { message } } = await request(app)
            .delete(`/user/${userId}`)
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(200);
        expect(message).toBe(`Successfully deleted user with id: ${userId}`);
    });

    test('Fail to delete a user with an invalid id', async () => {
        const { statusCode, body: { message } } = await request(app)
            .delete(`/user/${userId}3`)
            .set('Authorization', `Bearer ${testUser.token}`);

        expect(statusCode).toBe(400);
        expect(message).toBe(`id: ${userId}3 is not valid`);
    });
});