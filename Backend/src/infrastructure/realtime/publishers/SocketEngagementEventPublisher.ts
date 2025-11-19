import { io } from "../SocketGateway";
import { IEngagementEventPublisher } from "../../../domain/common/services/IEngagementEventPublisher";

export class SocketEngagementEventPublisher
  implements IEngagementEventPublisher
{
  async publishLikeToggled(event: {
    productId: string;
    doctorId: string;
    liked: boolean;
    totalLikes: number;
  }): Promise<void> {
    const room = `product:${event.productId}`;
    io.to(room).emit("like:toggled", {
      productId: event.productId,
      doctorId: event.doctorId,
      liked: event.liked,
      counts: { likes: event.totalLikes },
    });
    return Promise.resolve();
  }

  async publishInterestToggled(event: {
    productId: string;
    doctorId: string;
    interested: boolean;
    totalInterests: number;
  }): Promise<void> {
    const room = `product:${event.productId}`;
    io.to(room).emit("interest:toggled", {
      productId: event.productId,
      doctorId: event.doctorId,
      interested: event.interested,
      counts: { interests: event.totalInterests },
    });
    return Promise.resolve();
  }
}
