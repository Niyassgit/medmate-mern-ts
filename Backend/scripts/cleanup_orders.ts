
import { prisma } from "../src/infrastructure/config/db";

async function cleanupOrders() {
    console.log("Starting cleanup of orders and commissions...");

    try {
        // 1. Delete all Commissions
        const deletedCommissions = await prisma.commission.deleteMany({});
        console.log(`Deleted ${deletedCommissions.count} commissions.`);

        // 2. Delete all Orders
        const deletedOrders = await prisma.order.deleteMany({});
        console.log(`Deleted ${deletedOrders.count} orders.`);

        // Note regarding Prescriptions:
        // If prescriptions were marked as USED, you might want to reset them to APPROVED/PENDING
        // if you want to re-use them for testing.
        // Uncomment the following lines if you want to reset ALL prescriptions to APPROVED.
        /*
        const updatedPrescriptions = await prisma.prescription.updateMany({
           where: { status: 'USED' },
           data: { status: 'APPROVED' }
        });
        console.log(`Reset ${updatedPrescriptions.count} prescriptions to APPROVED.`);
        */

        console.log("Cleanup completed successfully.");
    } catch (error) {
        console.error("Error during cleanup:", error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupOrders();
