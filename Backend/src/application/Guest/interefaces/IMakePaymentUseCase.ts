export interface IMakePaymentUseCase {
    execute(
        prescriptionId: string,
        addressId: string,
        paymentMethod: string,
        userId?:string
    ): Promise<string | null>;
}