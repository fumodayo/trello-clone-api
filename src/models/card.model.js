import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectID } from "mongodb";

// Define Card collection
const cardCollectionName = "cards";
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // also ObjectId when create new
  columnId: Joi.string().required(), // also ObjectId when create new
  title: Joi.string().required().min(3).max(30).trim(),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  // When deleting columns, cards are not deleted directly to the database, but stored in records
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, {
    abortEarly: false, // After running, the error shows (don't stop the part that got error)
  });
};

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data);
    const insertValue = {
      ...validatedValue,
      boardId: ObjectID(validatedValue.boardId),
      columnId: ObjectID(validatedValue.columnId),
    };
    const result = await getDB()
      .collection(cardCollectionName)
      .insertOne(insertValue);
    return result.ops[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const CardModel = { cardCollectionName,createNew };
