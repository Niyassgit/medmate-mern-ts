import { io } from "../SocketGateway";
import { IEngagementEventPublisher } from "../../../application/common/interfaces/IEngagementEventPublisher";

export class SocketEngagementEventPublisher
  implements IEngagementEventPublisher
{
  async publishLikeToggled(event: {
    productId: string;
    doctorId: string;
    liked: boolean;
    totalLikes: number;
  }): Promise<void> {
    io.to(`product:${event.productId}`).emit("like:toggled", {
      productId: event.productId,
      doctorId: event.doctorId,
      liked: event.liked,
      counts: { likes: event.totalLikes },
    });
  }
}
