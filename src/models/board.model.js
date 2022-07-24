import Joi from "joi";
import { ObjectID } from "mongodb";
import { getDB } from "*/config/mongodb";
import { ColumnModel } from "./column.model";
import { CardModel } from "./card.model";

// Define Board collection
const boardCollectionName = "boards";
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  // When deleting columns, cards are not deleted directly to the database, but stored in records
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, {
    abortEarly: false, // After running, the error shows (don't stop the part that got error)
  });
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);
    const result = await getDB()
      .collection(boardCollectionName)
      .insertOne(value);
    return result.ops[0];
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @param {string} boardId
 * @param {string} columnId
 */

const pushColumnOrder = async (boardId, columnId) => {
  try {
    const result = await getDB()
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectID(boardId) },
        { $push: { columnOrder: columnId } },
        { returnOriginal: false } /*return log data after update*/
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const getFullBoard = async (boardId) => {
  try {
    const result = await getDB()
      .collection(boardCollectionName)
      .aggregate([
        { $match: { _id: ObjectID(boardId) } },
        // {
        //   $addFields: {
        //     _id: {
        //       $toString: "$_id", // Object -> String(toString) assign _idTest
        //     },
        //   },
        // },
        {
          $lookup: {
            from: ColumnModel.columnCollectionName, // collection name
            localField: "_id",
            foreignField: "boardId",
            as: "columns", // array columns
          },
        },
        {
          $lookup: {
            from: CardModel.cardCollectionName, // collection name
            localField: "_id",
            foreignField: "boardId",
            as: "cards", // array cards
          },
        },
      ])
      .toArray();

    return result[0] || {};
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardModel = { createNew, pushColumnOrder, getFullBoard };
