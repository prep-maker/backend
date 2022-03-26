import request from 'supertest';
import { app } from '../../app';
import { createNewUser } from './utils';

describe('User Router', () => {
  describe('POST /:userId/writings', () => {
    it('유저가 새 글을 생성하면 201 응답코드와 내용이 빈 writing을 응답한다', async () => {
      const user = await createNewUser();

      const res = await request(app).post(`/users/${user.id}/writings`);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: 'Untitled',
        author: user.id,
        isDone: false,
      });
    });
  });
});
