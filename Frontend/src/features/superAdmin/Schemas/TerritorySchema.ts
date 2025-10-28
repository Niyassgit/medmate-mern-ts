import {z} from "zod";


export const TeritorySchema=z.object({
    name:z.string().min(3,"Territory name is required"),
    region:z.string().min(3,"Region is required")
});
export type TerritorySchemaDTO=z.infer<typeof TeritorySchema>;