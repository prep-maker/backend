import http from 'http';
import request from 'supertest';
import { app, startServer, stopServer } from '../app.js';
import { ERROR } from '../common/constants/error.js';
import { WritingResponse } from '../common/types/writing.js';
import { clearDB } from '../loaders/mongoose.js';
import {
  createNewUser,
  createNewWriting,
  makeFakeUserDetail,
} from './utils.js';

describe('Integration test', () => {
  let server: http.Server;
  beforeAll(() => {
    server = startServer();
  });
  afterAll(async () => {
    await clearDB();
    stopServer(server);
  });

  describe('Auth Routser', () => {
    describe('POST /auth/signup', () => {
      it('유저가 가입하면 201 코드와 id, email, name, token을 응답한다', async () => {
        const user = makeFakeUserDetail();
        const res = await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(user);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          email: user.email,
          name: user.name,
        });
        expect(res.body.id.length).toBeGreaterThan(0);
        expect(res.body.token.length).toBeGreaterThan(0);
      });

      it('이미 존재하는 유저가 가입하면 400 코드와 에러 메세지를 응답한다.', async () => {
        const user = makeFakeUserDetail();
        const firstRes = await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(user);
        expect(firstRes.status).toBe(201);

        const res = await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(user);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.DUPLICATE_EMAIL });
      });

      const user = makeFakeUserDetail();
      test.each([
        {
          property: 'email',
          body: { ...user, email: '' },
          message: ERROR.EMAIL_REQUIRED,
        },
        {
          property: 'name',
          body: { ...user, name: '' },
          message: ERROR.NAME_REQUIRED,
        },

        {
          property: 'password',
          body: { ...user, password: '' },
          message: ERROR.PASSWORD_REQUIRED,
        },
      ])(
        `요청 body에 $property 프로퍼티가 비어있으면 400 코드와 "$message" 메세지를 응답한다`,
        async ({ body, message }) => {
          const res = await request(app)
            .post('/auth/signup')
            .set('Accept', 'application/json')
            .send(body);

          expect(res.status).toBe(400);
          expect(res.body).toEqual({ message });
        }
      );

      it('잘못된 형식의 이메일에는 400 코드와 에러 메세지를 응답한다.', async () => {
        const user = makeFakeUserDetail();
        const res = await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send({ ...user, email: 'email' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_EMAIL });
      });
    });

    describe('POST /auth/signin', () => {
      it('유저가 로그인하면 200 코드와 id, email, name, token을 응답한다.', async () => {
        const user = makeFakeUserDetail();
        const signupRes = await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(user);

        const res = await request(app)
          .post('/auth/signin')
          .set('Accept', 'application/json')
          .send({
            email: user.email,
            password: user.password,
          });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          id: signupRes.body.id,
          email: user.email,
          name: user.name,
          token: signupRes.body.token,
        });
      });

      it('가입하지 않은 유저가 로그인하면 404 코드와 에러 메세지를 응답한다.', async () => {
        const user = makeFakeUserDetail();
        const res = await request(app)
          .post('/auth/signin')
          .set('Accept', 'application/json')
          .send({
            email: user.email,
            password: user.password,
          });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: ERROR.NOT_FOUND_USER });
      });

      it('잘못된 비밀번호를 입력하면 400 코드와 에러 메세지를 응답한다.', async () => {
        const user = makeFakeUserDetail();
        await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(user);

        const res = await request(app)
          .post('/auth/signin')
          .set('Accept', 'application/json')
          .send({
            email: user.email,
            password: '123456',
          });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_LOGIN });
      });

      const user = makeFakeUserDetail();
      test.each([
        {
          property: 'email',
          body: { email: '', password: user.password },
          message: ERROR.EMAIL_REQUIRED,
        },
        {
          property: 'password',
          body: { email: user.email, password: '' },
          message: ERROR.PASSWORD_REQUIRED,
        },
      ])(
        `요청 body에 $property 프로퍼티가 비어있으면 400 코드와 "$message" 메세지를 응답한다`,
        async ({ body, message }) => {
          const res = await request(app)
            .post('/auth/signin')
            .set('Accept', 'application/json')
            .send(body);

          expect(res.status).toBe(400);
          expect(res.body).toEqual({ message });
        }
      );
    });
  });

  describe('Writing Router', () => {
    describe('GET /writings/:writingId', () => {
      it('writingId params와 일치하는 writing을 응답한다. ', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app).get(`/writings/${writing.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          id: writing.id,
          isDone: false,
          title: 'Untitled',
          author: user.id,
          blocks: [],
        });
      });

      it('잘못된 형식의 writingId로 요청을 보내면 400 코드와 에러 메세지로 응답한다', async () => {
        const res = await request(app).get(`/writings/abcd`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_WRITING_ID });
      });

      it('존재하지 않는 writingId로 새 글 생성 요청을 보내면 404 코드와 에러메세지로 응답한다', async () => {
        const res = await request(app).get(
          `/writings/623eb7bdfa3d8f71a10325f1`
        );

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: ERROR.NOT_FOUND_WRITING });
      });
    });

    describe('PUT /writings/:writingId', () => {
      it('writingId params와 일치하는 writing을 요청 내용으로 업데이트하고 200 코드와 writing을 응답한다.', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app)
          .put(`/writings/${writing.id}`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          id: writing.id,
          title: 'test',
          isDone: true,
          author: user.id,
          blocks: [],
        });
      });

      it('잘못된 형식의 writingId로 요청을 보내면 400 코드와 에러 메세지로 응답한다', async () => {
        const res = await request(app)
          .put(`/writings/abcd`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_WRITING_ID });
      });

      it('존재하지 않는 writingId로 새 글 생성 요청을 보내면 404 코드와 에러 메세지로 응답한다', async () => {
        const res = await request(app)
          .put(`/writings/623eb7bdfa3d8f71a10325f1`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: ERROR.NOT_FOUND_WRITING });
      });

      it('업데이트 요청 내용 blocks 프로퍼티가 포함되어 있으면 400 코드와 에러 메세지로 응답한다', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app)
          .put(`/writings/${writing.id}`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
            blocks: [],
          });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.BLOCKS_EXISTING });
      });
    });

    describe('POST /writings/:writingId/blocks/', () => {
      it('요청된 내용으로 새 블록을 생성하고 201 코드와 생성된 block을 응답한다.', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app)
          .post(`/writings/${writing.id}/blocks`)
          .set('Accept', 'application/json')
          .send({
            type: 'P',
            paragraphs: [
              {
                type: 'P',
                content: 'test',
                comments: [],
              },
            ],
          });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          type: 'P',
          paragraphs: [
            {
              type: 'P',
              content: 'test',
              comments: [],
            },
          ],
        });
      });

      it('잘못된 형식의 writingId로 요청을 보내면 400 코드와 에러 메세지로 응답한다', async () => {
        const res = await request(app)
          .put(`/writings/abcd`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_WRITING_ID });
      });

      it('존재하지 않는 writingId로 새 글 생성 요청을 보내면 404 코드와 에러메세지로 응답한다', async () => {
        const res = await request(app)
          .put(`/writings/623eb7bdfa3d8f71a10325f1`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: ERROR.NOT_FOUND_WRITING });
      });

      test.each([
        {
          property: 'type',
          body: { type: 'A', paragraphs: [] },
          message: ERROR.BLOCK_TYPE,
        },
        {
          property: 'paragraphs',
          body: { type: 'P', paragraphs: '' },
          message: ERROR.PARAGRAPHS_ARRAY_REQUIRED,
        },
      ])(
        `요청 body 잘못된 $property 프로퍼티가 입력되면 400 코드와 에러 메세지를 응답한다`,
        async ({ body, message }) => {
          const user = await createNewUser();
          const writing = await createNewWriting(user);

          const res = await request(app)
            .post(`/writings/${writing.id}/blocks`)
            .set('Accept', 'application/json')
            .send(body);

          expect(res.status).toBe(400);
          expect(res.body).toEqual({ message });
        }
      );
    });

    describe('PUT /writings/:wrtingId/blocks', () => {
      it('요청된 내용으로 글의 blocks를 업데이트하고 200코드와 업데이트된 block들을 응답한다.', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app)
          .put(`/writings/${writing.id}/blocks`)
          .set('Accept', 'application/json')
          .send([
            {
              type: 'P',
              paragraphs: [
                {
                  type: 'P',
                  content: 'test',
                  comments: [],
                },
              ],
            },
            {
              type: 'R',
              paragraphs: [
                {
                  type: 'R',
                  content: 'test',
                  comments: [],
                },
              ],
            },
          ]);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject([
          {
            type: 'P',
            paragraphs: [
              {
                type: 'P',
                content: 'test',
                comments: [],
              },
            ],
          },
          {
            type: 'R',
            paragraphs: [
              {
                type: 'R',
                content: 'test',
                comments: [],
              },
            ],
          },
        ]);
      });

      it('잘못된 type의 block으로 업데이트를 요청하면 400코드와 에러 메세지를 응답한다', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app)
          .put(`/writings/${writing.id}/blocks`)
          .set('Accept', 'application/json')
          .send([
            {
              type: 'A',
              paragraphs: [
                {
                  type: 'A',
                  content: 'test',
                  comments: [],
                },
              ],
            },
          ]);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.BLOCK_TYPE });
      });
    });

    describe('PUT /writings/:writingId/blocks/:blockId', () => {
      it('요청대로 block을 업데이트하고 200 코드와 업데이트된 block을 응답한다.', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);
        const firstRes = await request(app)
          .post(`/writings/${writing.id}/blocks`)
          .set('Accept', 'application/json')
          .send({
            type: 'P',
            paragraphs: [
              {
                type: 'P',
                content: 'test',
                comments: [],
              },
            ],
          });
        const block = firstRes.body;

        const result = await request(app)
          .put(`/writings/${writing.id}/blocks/${block.id}`)
          .set('Accept', 'application/json')
          .send({
            type: 'R',
            paragraphs: [
              {
                type: 'R',
                content: 'test 2',
                comments: [],
              },
            ],
          });

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
          id: block.id,
          type: 'R',
          paragraphs: [
            {
              type: 'R',
              content: 'test 2',
              comments: [],
            },
          ],
        });
      });

      it('잘못된 형식의 writingId 혹은 blockId params로 요청을 보내면 400 코드와 에러 메세지로 응답한다', async () => {
        const firstRes = await request(app)
          .put('/writings/abcd/blocks/623eb7bdfa3d8f71a10325f1')
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });

        expect(firstRes.status).toBe(400);
        expect(firstRes.body).toEqual({ message: ERROR.INVALID_WRITING_ID });
      });

      it('존재하지 않는 writingId혹은 blockId로 요청을 보내면 404 코드와 에러메세지로 응답한다', async () => {
        const firstRes = await request(app)
          .put(
            '/writings/623eb7bdfa3d8f71a10325f1/blocks/623eb7bdfa3d8f71a10325f1'
          )
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });
        expect(firstRes.status).toBe(404);
        expect(firstRes.body).toEqual({ message: ERROR.NOT_FOUND_WRITING });

        const user = await createNewUser();
        const writing = await createNewWriting(user);
        const secondRes = await request(app)
          .put(`/writings/${writing.id}/blocks/623eb7bdfa3d8f71a10325f1`)
          .set('Accept', 'application/json')
          .send({
            title: 'test',
            isDone: true,
          });
        expect(secondRes.status).toBe(404);
        expect(secondRes.body).toEqual({ message: ERROR.NOT_FOUND_BLOCK });
      });
    });

    describe('DELETE /writings/:writingId/blocks/:blcokId', () => {
      it('params의 blockId와 일치하는 block을 삭제하고 204 코드로 응답한다', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);
        const created = await request(app)
          .post(`/writings/${writing.id}/blocks/`)
          .set('Accept', 'application/json')
          .send({
            type: 'P',
            paragraphs: [
              {
                type: 'P',
                content: 'test',
                comments: [],
              },
            ],
          });
        const block = created.body;

        const firstRes = await request(app).delete(
          `/writings/${writing.id}/blocks/${block.id}`
        );
        const writingRes = await request(app).get(`/writings/${writing.id}`);

        expect(firstRes.status).toBe(204);
        expect(writingRes.body.blocks).not.toContain(block.id);
      });
    });
  });

  describe('User Router', () => {
    describe('POST /users/:userId/writings', () => {
      it('새 글을 생성하고 201 코드와 내용이 빈 writing을 응답한다', async () => {
        const user = await createNewUser();

        const res = await request(app).post(`/users/${user.id}/writings`);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
          title: 'Untitled',
          author: user.id,
          isDone: false,
        });
      });

      it('잘못된 형식의 userId로 새 글 생성 요청을 보내면 400 코드와 에러 메세지로 응답한다', async () => {
        const res = await request(app).post(`/users/abcd/writings`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_USER_ID });
      });

      it('존재하지 않는 userId로 새 글 생성 요청을 보내면 404 코드와 에러메세지로 응답한다', async () => {
        const res = await request(app).post(
          `/users/623eb7bdfa3d8f71a10325f1/writings`
        );

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: ERROR.NOT_FOUND_USER });
      });
    });

    describe('GET /users/:userId/writings', () => {
      it('state 쿼리가 없으면 유저의 전체 writing을 응답한다.', async () => {
        const user = await createNewUser();
        const writings = await Promise.all([
          createNewWriting(user),
          createNewWriting(user),
          createNewWriting(user),
          createNewWriting(user),
        ]);
        await Promise.all(
          [writings[0], writings[1]].map((writing) =>
            request(app)
              .put(`/writings/${writing.id}`)
              .set('Accept', 'application/json')
              .send({
                title: 'test',
                isDone: true,
              })
          )
        );

        const res = await request(app).get(`/users/${user.id}/writings`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(4);
      });

      it('state 쿼리가 done이면 isDone이 true인 writing들만 응답한다', async () => {
        const user = await createNewUser();
        const writings = await Promise.all([
          createNewWriting(user),
          createNewWriting(user),
          createNewWriting(user),
          createNewWriting(user),
        ]);
        await Promise.all(
          [writings[0], writings[1]].map((writing) =>
            request(app)
              .put(`/writings/${writing.id}`)
              .set('Accept', 'application/json')
              .send({
                title: 'test',
                isDone: true,
              })
          )
        );

        const res = await request(app).get(
          `/users/${user.id}/writings?state=done`
        );

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        res.body.forEach((writing: WritingResponse) =>
          expect(writing.isDone).toBeTruthy()
        );
      });

      it('state 쿼리가 editing이면 isDone이 false인 writing들만 응답한다', async () => {
        const user = await createNewUser();
        const writings = await Promise.all([
          createNewWriting(user),
          createNewWriting(user),
          createNewWriting(user),
          createNewWriting(user),
        ]);
        await Promise.all(
          [writings[0], writings[1]].map((writing) =>
            request(app)
              .put(`/writings/${writing.id}`)
              .set('Accept', 'application/json')
              .send({
                title: 'test',
                isDone: true,
              })
          )
        );

        const res = await request(app).get(
          `/users/${user.id}/writings?state=editing`
        );

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        res.body.forEach((writing: WritingResponse) =>
          expect(writing.isDone).toBeFalsy()
        );
      });

      it('editing, done 외의 state 쿼리가 입력되면 400 코드와 에러 메세지를 응답한다', async () => {
        const user = await createNewUser();

        const res = await request(app).get(
          `/users/${user.id}/writings?state=hello`
        );

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR.INVALID_WIRINTG_QUERY });
      });
    });

    describe('DELETE /users/:userId/writings/:writingId', () => {
      it('params의 writingId와 일치하는 writing을 삭제하고 200 코드와 삭제된 글의 block들로 응답한다', async () => {
        const user = await createNewUser();
        const writing = await createNewWriting(user);

        const res = await request(app).delete(
          `/users/${user.id}/writings/${writing.id}`
        );
        const writingRes = await request(app).get(`/writings/${writing.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(writing.blocks);
        expect(writingRes.status).toBe(404);
        expect(writingRes.body).toEqual({ message: ERROR.NOT_FOUND_WRITING });
      });
    });
  });
});
