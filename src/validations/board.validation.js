import Joi from "joi";
import { HttpStatusCode } from "*/utilities/constants";

//** Validate data in client and server */

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().required().min(3).max(20).trim(),
  });

  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

const update = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().min(3).max(20).trim(),
    columnOrder: Joi.array().items(Joi.string()),
  });

  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true, // no need for predefined in condition
    });
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

export const BoardValidation = { createNew, update };
