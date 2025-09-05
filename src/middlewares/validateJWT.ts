import("dotenv/config");
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels";
import { ExtendRequest } from "../types/extendRequest";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    res.status(403).send("Unauthorized");
    return;
  }

  const token = authorizationHeader?.split(" ")[1];

  if (!token) {
    res.status(403).send("Token was not found");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid Token");
      return;
    }
    if (!payload) {
      res.status(403).send("invalid Payload");
      return;
    }
    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    const user = await userModel.findOne({ email: userPayload.email });

    req.user = user;
    next();
  });
};

export default validateJWT;
