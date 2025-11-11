import { Request, Response } from "express";
import User from "./auth.model";
import { generateTokens } from "./auth.service";
import { signupSchema, loginSchema } from "./auth.validation";
import { sendResponse } from "../../utils/response";

export const signup = async (req: Request, res: Response) => {
    try {
        const validation = signupSchema.safeParse(req.body); //using safe parse to return valid object
        if (!validation.success) {
            return sendResponse(res, 400, "Validation failed", validation.error.issues);
        }


        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return sendResponse(res, 400, "User already exists");

        const user = await User.create({ name, email, password, role });

        return sendResponse(res, 201, "User registered successfully", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // const validation = loginSchema.safeParse(req.body);
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return sendResponse(res, 400, "Validation failed", validation.error.issues);
        }


        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return sendResponse(res, 404, "User not found");

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return sendResponse(res, 401, "Invalid credentials");

        const tokens = generateTokens(user);

        return sendResponse(res, 200, "Login successful", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            ...tokens,
        });
    } catch (error: any) {
        return sendResponse(res, 500, error.message);
    }
};
