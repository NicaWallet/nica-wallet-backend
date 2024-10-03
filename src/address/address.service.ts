import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
    constructor(private readonly prisma: PrismaService) { }

    // Servicio que maneja la obtención de direcciones
    async getAdressByUserId(userId: number, paginationOptions: any) {
        const { page, limit, all } = paginationOptions;

        if (all) {
            return {
                data: await this.prisma.address.findMany({
                    where: { user_id: userId },
                }),
                total: await this.prisma.address.count({
                    where: { user_id: userId },
                }),
            };
        }

        const skip = (page - 1) * limit;
        const take = limit;

        const data = await this.prisma.address.findMany({
            where: { user_id: userId },
            skip,
            take,
        });

        const total = await this.prisma.address.count({
            where: { user_id: userId },
        });

        return { data, total };
    }

    // Servicio para obtener todas las direcciones
    async getAllAddresses() {
        const data = await this.prisma.address.findMany();
        const total = await this.prisma.address.count();

        return {
            data,
            total, // Agregamos el conteo de todos los registros
        };
    }

    // Servicio para obtener direcciones por tipo
    async getAddressesByType(userId: number, addressType: string) {
        return this.prisma.address.findMany({
            where: {
                user_id: userId,
                address_type: addressType,
            },
        });
    }

    async updateAddressById(addressId: number, updateData: any) {
        return this.prisma.address.update({
            where: { address_id: addressId },
            data: updateData,
        });
    }

    async deleteAddressById(addressId: number) {
        return this.prisma.address.delete({
            where: { address_id: addressId },
        });
    }

    async getAddressesByCountry(country: string) {
        return this.prisma.address.findMany({
            where: { country },
        });
    }

    async getAddressesByPostalCode(postalCode: string) {
        return this.prisma.address.findMany({
            where: { postal_code: postalCode },
        });
    }

    async getPrimaryAddress(userId: number) {
        return this.prisma.address.findFirst({
            where: {
                user_id: userId,
                address_type: 'primary',
            },
        });
    }

    async getAddressesByCity(city: string) {
        return this.prisma.address.findMany({
            where: { city },
        });
    }

    async updateAddressByUserId(userId: number, updateData: any) {
        // Encuentra y actualiza la dirección relacionada con el userId
        return this.prisma.address.updateMany({
            where: {
                user_id: userId,
            },
            data: updateData,
        });
    }


}
