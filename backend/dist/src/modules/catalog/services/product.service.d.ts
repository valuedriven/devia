import { PrismaService } from '../../../database/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto, tenantId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        status: string;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        categoryId: string;
    }>;
    findAll(tenantId: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        status: string;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        categoryId: string;
    })[]>;
    findAllActive(tenantId: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        status: string;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        categoryId: string;
    })[]>;
    findOne(id: string, tenantId: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        status: string;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        categoryId: string;
    }) | null>;
    update(id: string, updateProductDto: Partial<CreateProductDto>, tenantId: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        imageUrl: string | null;
        status: string;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        categoryId: string;
    }>;
    remove(id: string, tenantId: string): Promise<boolean>;
}
