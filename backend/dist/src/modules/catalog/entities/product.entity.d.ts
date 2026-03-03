export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    status: 'active' | 'inactive';
    stock: number;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
}
