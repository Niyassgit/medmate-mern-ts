export interface IDeleteAddressUseCase {
    execute(addressId: string, userId?: string): Promise<string>;
}
