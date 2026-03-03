import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
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
