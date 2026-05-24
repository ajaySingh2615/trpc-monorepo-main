import { randomBytes, createHmac } from "node:crypto";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import * as JWT from "jsonwebtoken";
import { env } from "../env";
import {
  createUserWithEmailAndPasswordInput,
  CreateUserWithEmailAndPasswordInputType,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
  signInUserWithEmailAndPasswordInput,
  SignInUserWithEmailAndPasswordInputType,
} from "./model";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return result[0] ?? null;
  }

  private async generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = generateUserTokenPayload.parse(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async verifyUserToken(
    token: string,
  ): Promise<GenerateUserTokenPayloadType> {
    try {
      const result = JWT.verify(
        token,
        env.JWT_SECRET,
      ) as GenerateUserTokenPayloadType;
      return result;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  public async getUserInfoById(id: string) {
    const result = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        fullName: usersTable.fullName,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!result[0]) throw new Error(`User with id ${id} does not exits`);
    return result[0];
  }

  public async createUserWithEmailAndPassword(
    payload: CreateUserWithEmailAndPasswordInputType,
  ) {
    const { fullName, email, password } =
      createUserWithEmailAndPasswordInput.parse(payload);

    // check if user already exixts
    const existing = await this.getUserByEmail(email);
    if (existing) throw new Error(`User with email ${email} already exists`);

    // generate random salt and hash password
    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(salt, password);

    // insert into db
    const inserted = await db
      .insert(usersTable)
      .values({
        email,
        fullName,
        password: hash,
        salt,
      })
      .returning({ id: usersTable.id });

    if (!inserted[0]?.id) {
      throw new Error("Something went wrong while creating user");
    }

    const userId = inserted[0].id;
    const { token } = await this.generateUserToken({ id: userId });

    return { id: userId, token };
  }

  public async signInUserWithEmailAndPassword(
    payload: SignInUserWithEmailAndPasswordInputType,
  ) {
    const { email, password } =
      signInUserWithEmailAndPasswordInput.parse(payload);

    const user = await this.getUserByEmail(email);
    if (!user) throw new Error(`User with email ${email} does not exist`);

    if (!user.password || !user.salt) {
      throw new Error("Invalid authentication method");
    }

    const hash = await this.generateHash(user.salt, password);
    if (hash !== user.password) throw new Error("Invalid email or password");

    const { token } = await this.generateUserToken({ id: user.id });
    return { id: user.id, token };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return { id };
  }
}

export default UserService;
