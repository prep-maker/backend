import mongoose from 'mongoose';
import { ObjectId } from '../common/types/mongoose';
import { UserAccount, UserRepository } from '../common/types/user';
import dummyUsers from './dummyUsers';

export const USER_ID = '621dfdcec156df650b5f6e74';

class UserModelStub implements UserRepository {
  findByEmail = async (email: string) =>
    dummyUsers.find((user) => user.email === email) as any;

  createNewUser = async (user: UserAccount) =>
    ({
      _id: mongoose.Types.ObjectId(USER_ID),
      email: user.email,
      name: user.name,
      writings: [],
    } as any);

  addWriting = async (userId: ObjectId, writingId: ObjectId) => {};

  deleteWriting = async (userId: string, writingId: string) => {};
}
export default UserModelStub;
