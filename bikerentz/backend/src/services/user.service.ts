import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserRepository } from "../repositories/user.repository";
import { ErrorResponse } from "../utils/errorResponse";
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from "../dtos/user.dto";
import { sendMail, passwordResetTemplate } from "../utils/mailer";

const userRepo = new UserRepository();

function signTokens(userId: string, email: string, role: "user" | "admin") {
  const accessToken = jwt.sign({ id: userId, email, role }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES || "15m") as jwt.SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign({ id: userId, email, role }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES || "7d") as jwt.SignOptions["expiresIn"],
  });
  return { accessToken, refreshToken };
}

export class UserService {
  async register(payload: RegisterDTO) {
    const existing = await userRepo.findByEmail(payload.email);
    if (existing) throw new ErrorResponse("Email already registered", 409);

    const hashed = await bcrypt.hash(payload.password, 10);
    const user = await userRepo.create({ ...payload, password: hashed });

    const tokens = signTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  async login(payload: LoginDTO) {
    const user = await userRepo.findByEmail(payload.email, true);
    if (!user) throw new ErrorResponse("Invalid email or password", 401);

    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) throw new ErrorResponse("Invalid email or password", 401);

    const tokens = signTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new ErrorResponse("User not found", 404);
    return user;
  }

  async updateProfile(userId: string, payload: UpdateProfileDTO) {
    const user = await userRepo.update(userId, payload);
    if (!user) throw new ErrorResponse("User not found", 404);
    return user;
  }

  async forgotPassword(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) return; // do not leak whether email exists

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/forgot-password/reset?token=${token}`;
    await sendMail({
      to: user.email,
      subject: "BikeRentz Password Reset",
      html: passwordResetTemplate(resetUrl),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userRepo.findByResetToken(hashedToken);
    if (!user) throw new ErrorResponse("Reset token is invalid or has expired", 400);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}
