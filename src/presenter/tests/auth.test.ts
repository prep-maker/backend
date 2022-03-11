import jwt from 'jsonwebtoken';
import config from '../../common/config';
import { ERROR } from '../../common/constants/error';
import { UserAccount, UserRepository } from '../../common/types/user';
import { useFailState, useSuccessState } from '../../common/utils/state';
import { EMAIL } from '../../fixtures/dummyUsers';
import UserModelStub, { USER_ID } from '../../fixtures/userModelStub';
import AuthService from '../../services/auth';
import AuthPresenter, { IAuthPresenter } from '../auth';

describe('AuthPresenter', () => {
  let authPresenter: IAuthPresenter;
  let userModel: UserRepository;
  let user: UserAccount;
  beforeEach(() => {
    userModel = new UserModelStub();
    authPresenter = new AuthPresenter(userModel, AuthService);
    user = {
      email: 'email@email.com',
      name: 'text',
      password: '12345',
    };
  });

  describe('signup', () => {
    it('가입하려는 유저의 email이 이미 존재하면 status 400의 FailState를 리턴한다.', async () => {
      const newUser = {
        ...user,
        email: EMAIL,
      };

      const result = await authPresenter.signup(newUser);

      expect(result).toEqual(useFailState(ERROR.DUPLICATE_EMAIL, 400));
    });

    it('가입이 완료되면 유저의 정보와 token을 SuccessState로 리턴한다.', async () => {
      const res = {
        id: USER_ID,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(res, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresIn,
      });

      const result = await authPresenter.signup(user);

      expect(result).toEqual(useSuccessState({ ...res, token }));
    });
  });

  describe('signin', () => {
    it('존재하지 않는 유저가 로그인하면 status 404의 FaliState를 리턴한다.', async () => {
      const result = await authPresenter.signin(user);

      expect(result).toEqual(useFailState(ERROR.NOT_FOUND_USER, 404));
    });

    it('password가 유효하지 않으면 status 400의 FailState를 리턴한다.', async () => {
      jest
        .spyOn(userModel, 'findByEmail')
        .mockResolvedValue({ isPasswordValid: async () => false } as any);

      const result = await authPresenter.signin(user);

      expect(result).toEqual(useFailState(ERROR.INVALID_LOGIN, 400));
    });

    it('유저가 로그인에 성공하면 유저의 정보와 token을 SuccessState로 리턴한다.', async () => {
      const res = {
        id: '621cafb14ed8fbc8812e845c',
        email: EMAIL,
        name: 'test1',
      };
      const token = jwt.sign(res, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresIn,
      });

      const result = await authPresenter.signin({ ...user, email: EMAIL });

      expect(result).toEqual(useSuccessState({ ...res, token }));
    });
  });
});
