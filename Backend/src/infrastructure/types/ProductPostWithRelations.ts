import { Prisma } from "@prisma/client";

export type ProductPostWithRelations=Prisma.ProductPostGetPayload<{
    include:{
        rep:{
            select:{id:true,name:true,companyName:true,user:{
                select:{profileImage:true}
            }}
        };
        _count:{select:{Likes:true;interests:true}};
        
    }
}>;