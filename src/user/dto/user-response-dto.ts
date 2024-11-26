import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class RoleDto {
    @ApiProperty({ description: 'Role name', example: 'Admin' })
    @IsString()
    role_name: string;

}

export class UserRoleDto {
    @ApiProperty({ description: 'Role name', example: 'Admin' })
    @IsString()
    role_name: string;

    @ApiProperty({ description: 'User ID associated with the role', example: 1 })
    @IsOptional()
    @IsNumber()
    user_id?: number;

    @ApiProperty({ description: 'Role ID', example: 1 })
    @IsOptional()
    @IsNumber()
    role_id?: number;
}


export class CountDto {
    @ApiProperty({ description: 'Number of addresses associated with the user', example: 2 })
    @IsOptional()
    @IsNumber()
    addresses?: number;

    @ApiProperty({ description: 'Number of budgets associated with the user', example: 7 })
    @IsOptional()
    @IsNumber()
    budgets?: number;

    @ApiProperty({ description: 'Number of goals associated with the user', example: 3 })
    @IsOptional()
    @IsNumber()
    goals?: number;

    @ApiProperty({ description: 'Number of recurring transactions associated with the user', example: 5 })
    @IsOptional()
    @IsNumber()
    recurringTransactions?: number;

    @ApiProperty({ description: 'Number of categories created by the user', example: 1 })
    @IsOptional()
    @IsNumber()
    Category?: number;
}

export class UserResponseDto {
    @ApiProperty({ description: 'User ID', example: 38 })
    @IsNumber()
    user_id: number;

    @ApiProperty({ description: 'First name of the user', example: 'John' })
    @IsString()
    first_name: string;

    @ApiProperty({ description: 'Middle name of the user (optional)', example: 'A.', nullable: true })
    @IsOptional()
    @IsString()
    middle_name?: string;

    @ApiProperty({ description: 'First surname of the user', example: 'Doe' })
    @IsOptional()
    @IsString()
    first_surname?: string;

    @ApiProperty({ description: 'Second surname of the user (optional)', example: null, nullable: true })
    @IsOptional()
    @IsString()
    second_surname?: string;

    @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
    @IsString()
    email: string;

    @ApiProperty({ description: 'Phone number of the user (optional)', example: '123-456-7890', nullable: true })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty({ description: 'Birthdate of the user (optional)', example: '1990-10-10T00:00:00.000Z', nullable: true })
    @IsOptional()
    @IsDateString()
    birthdate?: string;

    @ApiProperty({ description: 'Date when the user was created', example: '2024-10-02T16:31:10.374Z' })
    @IsOptional()
    @IsDateString()
    created_at?: Date;

    @ApiProperty({ description: 'Date when the user was last updated', example: '2024-10-02T16:31:10.374Z' })
    @IsOptional()
    @IsDateString()
    updated_at?: Date;

    @ApiProperty({
        description: 'Roles associated with the user',
        type: [UserRoleDto],
    })
    @IsOptional()
    @IsArray()
    userRoles?: UserRoleDto[];

    @ApiProperty({
        description: 'Counts of related resources (only returned for regular users)',
        type: CountDto,
        required: false,
    })
    @IsOptional()
    _count?: CountDto;

    @ApiProperty({
        description: 'Addresses associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    addresses?: any[];

    @ApiProperty({
        description: 'Budgets associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    budgets?: any[];

    @ApiProperty({
        description: 'Goals associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    goals?: any[];

    @ApiProperty({
        description: 'Recurring transactions associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    recurringTransactions?: any[];

    @ApiProperty({
        description: 'Categories associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    Category?: any[];

    @ApiProperty({ description: 'Status of the user', example: 'active' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({
        description: 'Billing information associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    billingInfos?: any[];

    @ApiProperty({
        description: 'Bank details associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    bankDetails?: any[];

    @ApiProperty({
        description: 'Incomes associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    incomes?: any[];

    @ApiProperty({
        description: 'Notifications associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    notifications?: any[];

    @ApiProperty({
        description: 'Preferences associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    preferences?: any[];

    @ApiProperty({
        description: 'Subcategories associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    Subcategory?: any[];

    @ApiProperty({
        description: 'Transactions associated with the user (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    transactions?: any[];

    @ApiProperty({
        description: 'User permissions (only for admins)',
        example: [],
        required: false,
    })
    @IsOptional()
    @IsArray()
    permissions?: any[];
}