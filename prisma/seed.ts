import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Eliminar registros dependientes
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.income.deleteMany();
    await prisma.recurringTransactions.deleteMany();
    await prisma.userConnectionLog.deleteMany();
    await prisma.userChangeHistory.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.preference.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.billingInfo.deleteMany();
    await prisma.bankDetails.deleteMany();
    await prisma.address.deleteMany();
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.rolePermission.deleteMany(); // Eliminar primero los permisos de roles
    await prisma.permission.deleteMany(); // Eliminar permisos también

    // Eliminar registros principales
    await prisma.user.deleteMany();
    await prisma.role.deleteMany(); // Ahora podemos eliminar roles

    const [readPermission, writePermission, deletePermission] = await Promise.all([
        prisma.permission.create({ data: { permission_name: 'READ' } }),
        prisma.permission.create({ data: { permission_name: 'WRITE' } }),
        prisma.permission.create({ data: { permission_name: 'DELETE' } }),
    ]);

    // Crear roles
    const adminRole = await prisma.role.create({
        data: {
            role_name: 'Admin',
        },
    });

    const userRole = await prisma.role.create({
        data: {
            role_name: 'User',
        },
    });

    // Asignar permisos a los roles
    await prisma.rolePermission.createMany({
        data: [
            { role_id: adminRole.role_id, permission_id: readPermission.permission_id }, // Admin can READ
            { role_id: adminRole.role_id, permission_id: writePermission.permission_id }, // Admin can WRITE
            { role_id: adminRole.role_id, permission_id: deletePermission.permission_id }, // Admin can DELETE
            { role_id: userRole.role_id, permission_id: readPermission.permission_id },  // User can READ
        ],
    });

    // Hashear contraseñas
    const adminHashedPassword = await bcrypt.hash('adminPassword', 10);
    const userHashedPassword = await bcrypt.hash('userPassword', 10);

    // Crear usuarios
    const adminUser = await prisma.user.create({
        data: {
            first_name: 'Admin',
            middle_name: 'A.',
            first_surname: 'Test',
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
            bankDetails: {
                create: {
                    account_number: '7896541230',
                    bank_name: 'Bank of America',
                    account_type: 'Savings',
                },
            },
        },
    });

    const regularUser = await prisma.user.create({
        data: {
            first_name: 'User',
            first_surname: 'Test',
            email: 'user@example.com',
            phone_number: '987-654-3210',
            birthdate: new Date('1990-10-10'),
            password: userHashedPassword,
            addresses: {
                create: [{
                    street: '789 Oak St',
                    city: 'Chicago',
                    state: 'IL',
                    postal_code: '60601',
                    country: 'USA',
                    address_type: 'Home',
                }],
            },
        },
    });

    // Asignar roles a los usuarios
    await prisma.userRole.createMany({
        data: [
            { user_id: adminUser.user_id, role_id: adminRole.role_id },
            { user_id: regularUser.user_id, role_id: userRole.role_id },
        ],
    });

    // Crear categorías
    const groceriesCategory = await prisma.category.create({
        data: {
            name: 'Groceries',
            user: { connect: { user_id: adminUser.user_id } },
        },
    });

    const entertainmentCategory = await prisma.category.create({
        data: {
            name: 'Entertainment',
            user: { connect: { user_id: adminUser.user_id } },
        },
    });

    // Crear subcategorías
    const foodSubcategory = await prisma.subcategory.create({
        data: {
            name: 'Food',
            category: { connect: { category_id: groceriesCategory.category_id } },
        },
    });

    const movieSubcategory = await prisma.subcategory.create({
        data: {
            name: 'Movies',
            category: { connect: { category_id: entertainmentCategory.category_id } },
        },
    });

    // Crear clasificaciones
    const essentialClassification = await prisma.classification.create({
        data: {
            name: 'Essential',
        },
    });

    const nonEssentialClassification = await prisma.classification.create({
        data: {
            name: 'Non-Essential',
        },
    });

    // Crear transacciones
    await prisma.transaction.createMany({
        data: [
            {
                amount: 100.0,
                date: new Date('2024-09-01'),
                user_id: adminUser.user_id,
                category_id: groceriesCategory.category_id,
                subcategory_id: foodSubcategory.subcategory_id,
                classification_id: essentialClassification.classification_id,
            },
            {
                amount: 50.0,
                date: new Date('2024-09-02'),
                user_id: regularUser.user_id,
                category_id: entertainmentCategory.category_id,
                subcategory_id: movieSubcategory.subcategory_id,
                classification_id: nonEssentialClassification.classification_id,
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
            category: { connect: { category_id: groceriesCategory.category_id } },
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
