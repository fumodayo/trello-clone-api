import { BoardModel } from "*/models/board.model";
import { cloneDeep } from "lodash";

const createNew = async (data) => {
  try {
    const result = await BoardModel.createNew(data);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getFullBoard = async (boardId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId);

    if (!board || !board.columns) {
      throw new Error("Board not found!");
    }

    const transformBoard = cloneDeep(board);
    // Filter deleted columns
    transformBoard.columns = transformBoard.columns.filter(
      (column) => !column._destroy
    );

    // Add card to each column
    transformBoard.columns.forEach((column) => {
      column.cards = transformBoard.cards.filter(
        (c) => c.columnId.toString() === column._id.toString()
      );
    });

    // Sort columns by columnOrder, sort cards by carOrder, this step will pass to frontend DEV
    // Remove cards data from boards
    delete transformBoard.cards;

    return transformBoard;
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardService = { createNew, getFullBoard };
