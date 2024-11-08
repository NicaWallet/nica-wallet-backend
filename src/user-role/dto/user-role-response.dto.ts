import { ApiProperty } from '@nestjs/swagger';

class UserConnectionLogDto {
    @ApiProperty({ example: 164 })
    connection_id: number;

    @ApiProperty({ example: '2024-11-07T04:04:51.795Z' })
    login_time: string;

    @ApiProperty({ example: null, nullable: true })
    logout_time: string | null;

    @ApiProperty({ example: 37 })
    user_id: number;
}

class RoleDto {
    @ApiProperty({ example: 36 })
    role_id: number;

    @ApiProperty({ example: 'Admin' })
    role_name: string;
}

class UserDto {
    @ApiProperty({ example: 37 })
    user_id: number;

    @ApiProperty({ example: 'Admin' })
    first_name: string;

    @ApiProperty({ example: 'A.', nullable: true })
    middle_name: string | null;

    @ApiProperty({ example: 'Test' })
    first_surname: string;

    @ApiProperty({ example: null, nullable: true })
    second_surname: string | null;

    @ApiProperty({ example: 'admin@example.com' })
    email: string;

    @ApiProperty({ example: '123-456-7890', nullable: true })
    phone_number: string | null;

    @ApiProperty({ example: '1985-05-15T00:00:00.000Z' })
    birthdate: string;

    @ApiProperty({ example: '2024-10-02T16:31:09.422Z' })
    created_at: string;

    @ApiProperty({ type: [UserConnectionLogDto] })
    userConnectionLogs: UserConnectionLogDto[];
}

export class UserResponseDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ type: RoleDto })
    role: RoleDto;
}
