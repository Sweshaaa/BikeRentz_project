import User, { IUser } from "../models/User";

export class UserRepository {
  findByEmail(email: string, withPassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    return withPassword ? query.select("+password") : query;
  }

  findById(id: string) {
    return User.findById(id);
  }

  create(data: Partial<IUser>) {
    return User.create(data);
  }

  update(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  findAll() {
    return User.find().sort({ createdAt: -1 });
  }

  delete(id: string) {
    return User.findByIdAndDelete(id);
  }

  findByResetToken(token: string) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");
  }
}
