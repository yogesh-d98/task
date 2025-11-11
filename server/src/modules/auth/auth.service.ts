import jwt, { Secret } from "jsonwebtoken";
import { IUser } from "./auth.model";

const JWT_SECRET = "I-BACUS-LMS-SuperSecret";
const JWT_REFRESH_SECRET = "I-BACUS-LMS-RefreshSecret";
const ACCESS_EXPIRES = "90m"; 
const REFRESH_EXPIRES = "7d";
console.log(JWT_SECRET , JWT_REFRESH_SECRET ,'secret')
export const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );

  return { accessToken, refreshToken };
};