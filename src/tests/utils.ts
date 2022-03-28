import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../app.js';
import { UserAccount, UserResponse } from '../common/types/user.js';
import { WritingResponse } from '../common/types/writing.js';

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

export const createNewWriting = async (): Promise<{
  writing: WritingResponse;
  user: UserResponse;
}> => {
  const user = await createNewUser();
  const res = await request(app).post(`/users/${user.id}/writings`);

  return { writing: res.body, user };
};
