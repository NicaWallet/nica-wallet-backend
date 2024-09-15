import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hashear la contraseña para ambos usuarios
    const adminHashedPassword = await bcrypt.hash('1234', 10);
    const guestHashedPassword = await bcrypt.hash('password', 10);

    // Crear usuarios
    const adminUser = await prisma.user.create({
        data: {
            first_name: 'Admin',
            middle_name: 'A.',
            first_surname: 'Test',
            second_surname: 'User',
            email: 'admin@example.com',
            phone_number: '123-456-7890',
            birthdate: new Date('1985-05-15'),
            password: adminHashedPassword,
            addresses: {
                create: [{
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    postal_code: '10001',
                    country: 'USA',
                    address_type: 'Home',
                }],
            },
            billingInfos: {
                create: {
                    credit_card_number: '1234-5678-9012-3456',
                    billingAddress: {
                        create: {
                            street: '456 Elm St',
                            city: 'Los Angeles',
                            state: 'CA',
                            postal_code: '90001',
                            country: 'USA',
                            address_type: 'Billing',
                        },
                    },
                },
            },
        },
    });

    const guestUser = await prisma.user.create({
        data: {
            first_name: 'Guest',
            middle_name: 'B.',
            first_surname: 'Test',
            second_surname: 'User',
            email: 'guest@example.com',
            phone_number: '987-654-3210',
            birthdate: new Date('1990-08-25'),
            password: guestHashedPassword,
            addresses: {
                create: {
                    street: '789 Oak St',
                    city: 'Chicago',
                    state: 'IL',
                    postal_code: '60601',
                    country: 'USA',
                    address_type: 'Home',
                },
            },
        },
    });

    // Crear roles
    const adminRole = await prisma.role.create({
        data: {
            role_name: 'Admin',
        },
    });

    const guestRole = await prisma.role.create({
        data: {
            role_name: 'Guest',
        },
    });

    // Asignar roles a los usuarios
    await prisma.userRole.createMany({
        data: [
            { user_id: adminUser.user_id, role_id: adminRole.role_id },
            { user_id: guestUser.user_id, role_id: guestRole.role_id },
        ],
    });

    // Crear categorías
    const category1 = await prisma.category.create({
        data: {
            name: 'Groceries',
            user: { connect: { user_id: adminUser.user_id } },
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: 'Entertainment',
            user: { connect: { user_id: adminUser.user_id } },
        },
    });

    // Crear subcategorías
    const subcategory1 = await prisma.subcategory.create({
        data: {
            name: 'Food',
            category: { connect: { category_id: category1.category_id } },
        },
    });

    const subcategory2 = await prisma.subcategory.create({
        data: {
            name: 'Movies',
            category: { connect: { category_id: category2.category_id } },
        },
    });

    // Crear clasificaciones
    const classification1 = await prisma.classification.create({
        data: {
            name: 'Essential',
        },
    });

    const classification2 = await prisma.classification.create({
        data: {
            name: 'Non-Essential',
        },
    });

    // Crear transacciones
    await prisma.transaction.createMany({
        data: [
            {
                amount: 150.0,
                date: new Date('2024-09-01'),
                user_id: adminUser.user_id,
                category_id: category1.category_id,
                subcategory_id: subcategory1.subcategory_id,
                classification_id: classification1.classification_id,
            },
            {
                amount: 50.0,
                date: new Date('2024-09-02'),
                user_id: adminUser.user_id,
                category_id: category2.category_id,
                subcategory_id: subcategory2.subcategory_id,
                classification_id: classification2.classification_id,
            },
        ],
    });

    // Crear ingresos
    await prisma.income.create({
        data: {
            amount: 3000.0,
            source: 'Salary',
            date: new Date('2024-09-01'),
            user: { connect: { user_id: adminUser.user_id } },
        },
    });

    // Crear objetivos
    await prisma.goal.create({
        data: {
            description: 'Save for vacation',
            target_amount: 1000.0,
            current_amount: 200.0,
            deadline: new Date('2024-12-01'),
            user: { connect: { user_id: adminUser.user_id } },
        },
    });

    // Crear presupuestos
    await prisma.budget.create({
        data: {
            amount: 500.0,
            start_date: new Date('2024-09-01'),
            end_date: new Date('2024-09-30'),
            user: { connect: { user_id: adminUser.user_id } },
            category: { connect: { category_id: category1.category_id } },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
