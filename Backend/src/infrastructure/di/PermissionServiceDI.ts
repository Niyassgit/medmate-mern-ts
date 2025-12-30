import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { PermissionService } from "../../application/common/services/PermissionService";

const medicalRepRepository = new MedicalRepRepository();
const subscriptionRepository = new SubscriptionRepository();

export const permissionService = new PermissionService(
  subscriptionRepository,
  medicalRepRepository
);


