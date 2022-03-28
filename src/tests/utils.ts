import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app.js';
import { UserAccount } from '../common/types/user.js';

export const makeFakeUserDetail = (): UserAccount => {
  const fakeUser = faker.helpers.userCard();

  return {
    email: fakeUser.email,
    name: fakeUser.username,
    password: faker.internet.password(10),
  };
};

export const createNewUser = async () => {
  const fakeUser = makeFakeUserDetail();
  const res = await request(app)
    .post('/auth/signup')
    .set('Accept', 'application/json')
    .send(fakeUser);

  return res.body as any;
};
