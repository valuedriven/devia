export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
    stock: number;
    status?: 'active' | 'inactive';
}
