import jwt from 'jsonwebtoken';
import config from '../../common/config';
import { ERROR } from '../../common/constants/error';
import { UserRepository } from '../../common/types/user';
import { useFailState, useSuccessState } from '../../common/utils/state';
import { EMAIL } from '../../fixtures/dummyUsers';
import UserModelStub, { USER_ID } from '../../fixtures/userModelStub';
import AuthService from '../../services/auth';
import AuthPresenter, { IAuthPresenter } from '../auth';

describe('AuthPresenter', () => {
  let authPresenter: IAuthPresenter;
  let userModel: UserRepository;
  beforeEach(() => {
    userModel = new UserModelStub();
    authPresenter = new AuthPresenter(userModel, AuthService);
  });

  describe('signup', () => {
    it('가입하려는 유저의 email이 이미 존재하면 status 400의 FailState를 리턴한다.', async () => {
      const newUser = {
        email: EMAIL,
        name: 'test',
        password: '12345',
      };

      const result = await authPresenter.signup(newUser);

      expect(result).toEqual(useFailState(ERROR.DUPLICATE_EMAIL, 400));
    });

    it('가입이 완료되면 유저의 정보와 token을 SuccessState로 리턴한다.', async () => {
      const newUser = {
        email: 'email@email.com',
        name: 'text',
        password: '12345',
      };

      const result = await authPresenter.signup(newUser);

      const res = {
        id: USER_ID,
        email: newUser.email,
        name: newUser.name,
      };
      const token = jwt.sign(res, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresIn,
      });
      expect(result).toEqual(useSuccessState({ ...res, token }));
    });
  });
});
