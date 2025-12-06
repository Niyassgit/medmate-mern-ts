import { Prisma } from "@prisma/client";

export type ProductPostWithRelations = Prisma.ProductPostGetPayload<{
  include: {
    rep: {
      select: {
        id: true;
        name: true;
        companyName: true;
        subscriptionStatus: true;
        subscriptionEnd: true;
        user: {
          select: { profileImage: true };
        };
      };
    };
    _count: { select: { likes: true; interests: true } };
  };
}>;
