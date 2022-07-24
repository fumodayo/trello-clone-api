import { CardModel } from "*/models/card.model";
import { ColumnModel } from "*/models/column.model";

const createNew = async (data) => {
  try {
    // transaction mongodb
    const newCard = await CardModel.createNew(data);

    // update columnOrder Array in board collection
    await ColumnModel.pushCardOrder(
      newCard.columnId.toString(),
      newCard._id.toString()
    );

    return newCard;
  } catch (error) {
    throw new Error(error);
  }
};

export const CardService = { createNew };
