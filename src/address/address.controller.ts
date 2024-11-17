import { Controller, Get, Param, Query, Patch, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { AddressService } from './address.service';
import { PermissionsGuard } from '../permission/permissions.guard'; // Importar el Guard
import { Permission } from '../permission/permission.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Address')
@Controller('address')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    // Get address by user ID
    @Get(':userId')
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get address by user ID' })
    @ApiResponse({ status: 200, description: 'Address retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'all', required: false, type: Boolean, description: 'Return all records, ignoring pagination' })
    findOne(
        @Param('userId') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('all') all?: boolean
    ) {
        const pageValue = page ?? 1;
        const limitValue = limit ?? 10;
        return this.addressService.getAdressByUserId(+userId, { page: pageValue, limit: limitValue, all });
    }

    // Get all addresses
    @Get()
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get all addresses' })
    @ApiResponse({ status: 200, description: 'Addresses retrieved successfully.' })
    findAll() {
        return this.addressService.getAllAddresses();
    }

    // Get addresses by type
    @Get(':userId/type/:addressType')
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get addresses by type' })
    @ApiResponse({ status: 200, description: 'Addresses by type retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No addresses found with the given type.' })
    getAddressesByType(@Param('userId') userId: string, @Param('addressType') addressType: string) {
        return this.addressService.getAddressesByType(+userId, addressType);
    }

    // Get addresses by country
    @Get('country/:country')
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get addresses by country' })
    @ApiResponse({ status: 200, description: 'Addresses by country retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No addresses found for the given country.' })
    getAddressesByCountry(@Param('country') country: string) {
        return this.addressService.getAddressesByCountry(country);
    }

    // Get addresses by postal code
    @Get('postal-code/:postalCode')
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get addresses by postal code' })
    @ApiResponse({ status: 200, description: 'Addresses by postal code retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No addresses found for the given postal code.' })
    getAddressesByPostalCode(@Param('postalCode') postalCode: string) {
        return this.addressService.getAddressesByPostalCode(postalCode);
    }

    // Update address by ID
    @Patch(':addressId')
    @Permission('WRITE') // Solo usuarios con el permiso 'WRITE' pueden acceder o admins
    @ApiOperation({ summary: 'Update address by ID' })
    @ApiResponse({ status: 200, description: 'Address updated successfully.' })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    updateAddress(@Param('addressId') addressId: string, @Body() updateData: any) {
        return this.addressService.updateAddressById(+addressId, updateData);
    }

    // Delete address by ID
    @Delete(':addressId')
    @Permission('DELETE') // Solo usuarios con el permiso 'DELETE' pueden acceder o admins
    @ApiOperation({ summary: 'Delete address by ID' })
    @ApiResponse({ status: 200, description: 'Address deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    deleteAddress(@Param('addressId') addressId: string) {
        return this.addressService.deleteAddressById(+addressId);
    }

    // Get primary address
    @Get(':userId/primary')
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get primary address' })
    @ApiResponse({ status: 200, description: 'Primary address retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Primary address not found.' })
    getPrimaryAddress(@Param('userId') userId: string) {
        return this.addressService.getPrimaryAddress(+userId);
    }

    // Get addresses by city
    @Get('city/:city')
    @Permission('READ') // Solo usuarios con el permiso 'READ' pueden acceder o admins
    @ApiOperation({ summary: 'Get addresses by city' })
    @ApiResponse({ status: 200, description: 'Addresses by city retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No addresses found for the given city.' })
    getAddressesByCity(@Param('city') city: string) {
        return this.addressService.getAddressesByCity(city);
    }

    // Update address by user ID
    @Patch(':userId')
    @Permission('WRITE') // Solo usuarios con el permiso 'WRITE' pueden acceder o admins
    @ApiOperation({ summary: 'Update address by user ID' })
    @ApiResponse({ status: 200, description: 'Address updated successfully.' })
    @ApiResponse({ status: 404, description: 'Address not found.' })
    updateAddressByUserId(@Param('userId') userId: string, @Body() updateData: any) {
        return this.addressService.updateAddressByUserId(+userId, updateData);
    }
}
