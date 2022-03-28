import http from 'http';
import request from 'supertest';
import { app, startServer, stopServer } from '../app.js';
import { ERROR } from '../common/constants/error.js';
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

  describe('POST /auth/signup', () => {
    it('유저가 가입하면 201 응답코드와 id, email, name, token을 응답한다', async () => {
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

    it('이미 존재하는 유저가 가입하면 400 응답코드와 에러 메세지를 응답한다.', async () => {
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
      `요청 body에 $property 프로퍼티가 비어있으면 400 응답코드와 "$message" 메세지를 응답한다`,
      async ({ body, message }) => {
        const res = await request(app)
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(body);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message });
      }
    );

    it('잘못된 형식의 이메일에는 400 응답코드와 에러 메세지를 응답한다.', async () => {
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
    it('유저가 로그인하면 200 응답코드와 id, email, name, token을 응답한다.', async () => {
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
      expect(res.body).toMatchObject({
        id: signupRes.body.id,
        email: user.email,
        name: user.name,
        token: signupRes.body.token,
      });
    });

    it('가입하지 않은 유저가 로그인하면 404 응답코드와 에러 메세지를 응답한다.', async () => {
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

    it('잘못된 비밀번호를 입력하면 400 응답코드와 에러 메세지를 응답한다.', async () => {
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
      `요청 body에 $property 프로퍼티가 비어있으면 400 응답코드와 "$message" 메세지를 응답한다`,
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
});
