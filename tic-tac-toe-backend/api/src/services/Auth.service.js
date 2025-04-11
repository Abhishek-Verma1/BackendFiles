import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  static async generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256',
      }
    );
  }
  static async registerUser({ email, password, name }) {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        stats: {
          create: {
            wins: 0,
            losses: 0,
            draws: 0,
          },
        },
      },
    });

    const token = await this.generateToken(newUser);

    return {
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
      token,
    };
  }

  // Login user
  static async loginUser({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = await this.generateToken(user);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }

  // Verify token
  static async authenticateToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

export default AuthService;
