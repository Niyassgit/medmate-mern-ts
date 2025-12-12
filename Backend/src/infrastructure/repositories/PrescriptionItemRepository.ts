import { PrescriptionItem, Prisma } from "@prisma/client";
import { IPrescriptionItem } from "../../domain/prescription/entites/IPrescriptionItem";
import { IPrescriptionItemRepository } from "../../domain/prescription/repositories/IPrescriptionItemRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { PrescriptionItemMapper } from "../mappers/PrescriptionItemMapper";

export class PrescriptionItemRepository
  extends BaseRepository<
    IPrescriptionItem,
    PrescriptionItem,
    Prisma.PrescriptionItemCreateInput,
    "prescriptionItem"
  >
  implements IPrescriptionItemRepository
{
  constructor() {
    super(
      prisma.prescriptionItem,
      (item) => PrescriptionItemMapper.toDomain(item)
    );
  }

  async createPrescriptionItem(
    data: Omit<IPrescriptionItem, "id">
  ): Promise<IPrescriptionItem> {
    const mappedData = PrescriptionItemMapper.toPersistance(data);
    return await this.create(mappedData);
  }

  async createPrescriptionItems(
    items: Omit<IPrescriptionItem, "id">[]
  ): Promise<IPrescriptionItem[]> {
    const mappedItems = items.map((item) =>
      PrescriptionItemMapper.toPersistance(item)
    );
    
    // Use Prisma transaction to create all items at once
    const createdItems = await prisma.$transaction(
      mappedItems.map((item) =>
        prisma.prescriptionItem.create({ data: item })
      )
    );
    
    return createdItems.map((item) => PrescriptionItemMapper.toDomain(item));
  }

  async findPrescriptionItemsByPrescriptionId(
    prescriptionId: string
  ): Promise<IPrescriptionItem[]> {
    const items = await prisma.prescriptionItem.findMany({
      where: { prescriptionId },
    });
    return items.map((item) => PrescriptionItemMapper.toDomain(item));
  }

  async deletePrescriptionItem(itemId: string): Promise<boolean> {
    await prisma.prescriptionItem.delete({
      where: { id: itemId },
    });
    return true;
  }
}

