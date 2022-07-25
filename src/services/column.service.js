import { ColumnModel } from "*/models/column.model";
import { BoardModel } from "*/models/board.model";

const createNew = async (data) => {
  try {
    // transaction mongodb
    const newColumn = await ColumnModel.createNew(data);
    newColumn.cards = [];

    // update columnOrder Array in board collection
    await BoardModel.pushColumnOrder(
      newColumn.boardId.toString(),
      newColumn._id.toString()
    );

    return newColumn;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };
    if (updateData._id) delete updateData._id;
    if (updateData.cards) delete updateData.cards;

    const result = await ColumnModel.update(id, updateData);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const ColumnService = { createNew, update };
