import { supabase } from './supabase';
import { Category, Product, Customer, Order, OrderItem } from './types';
import { fetchApi } from './api';

export async function getCategories(): Promise<Category[]> {
    try {
        const categories = await fetchApi<any[]>('/categories');
        return categories.map(cat => ({
            ...cat,
            id: String(cat.id),
            active: true
        })) as Category[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getCategory(id: string): Promise<Category | null> {
    try {
        const data = await fetchApi<any>(`/categories/${id}`);
        return {
            ...data,
            id: String(data.id),
            active: true
        } as Category;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    try {
        const data = await fetchApi<any>('/categories', {
            method: 'POST',
            body: JSON.stringify({ name: category.name })
        });
        return {
            ...data,
            id: String(data.id)
        } as Category;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
}

export async function updateCategory(id: string, category: Partial<Omit<Category, 'id'>>): Promise<Category | null> {
    try {
        const dto: any = {};
        if (category.name) dto.name = category.name;

        const data = await fetchApi<any>(`/categories/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dto)
        });
        return {
            ...data,
            id: String(data.id)
        } as Category;
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
}

export async function deleteCategory(id: string): Promise<boolean> {
    try {
        await fetchApi(`/categories/${id}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
}

export async function getProducts(): Promise<Product[]> {
    try {
        const products = await fetchApi<any[]>('/products');
        return products.map(p => ({
            ...p,
            id: String(p.id),
            image: p.imageUrl || p.image || '/placeholder.png',
            categoryId: String(p.categoryId),
            image_url: p.imageUrl || p.image || '/placeholder.png',
            category_id: String(p.categoryId),
            active: p.status === 'active'
        })) as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProduct(id: string): Promise<Product | null> {
    try {
        const data = await fetchApi<any>(`/products/${id}`);
        return {
            ...data,
            id: String(data.id),
            image: data.imageUrl || data.image || '/placeholder.png',
            categoryId: String(data.categoryId),
            image_url: data.imageUrl || data.image || '/placeholder.png',
            category_id: String(data.categoryId),
            active: data.status === 'active'
        } as Product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
        const dto = {
            name: product.name,
            description: product.description,
            price: Number(product.price),
            imageUrl: product.image_url || product.image,
            categoryId: String(product.category_id || product.categoryId),
            stock: Number(product.stock),
            status: product.active ? 'active' : 'inactive'
        };

        const data = await fetchApi<any>('/products', {
            method: 'POST',
            body: JSON.stringify(dto)
        });
        return {
            ...data,
            id: String(data.id)
        } as Product;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    try {
        const dto: any = {};
        if (product.name) dto.name = product.name;
        if (product.description) dto.description = product.description;
        if (product.price !== undefined) dto.price = Number(product.price);
        if (product.image_url || product.image) dto.imageUrl = product.image_url || product.image;
        if (product.category_id || product.categoryId) dto.categoryId = String(product.category_id || product.categoryId);
        if (product.stock !== undefined) dto.stock = Number(product.stock);
        if (product.active !== undefined) dto.status = product.active ? 'active' : 'inactive';

        const data = await fetchApi<any>(`/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dto)
        });
        return {
            ...data,
            id: String(data.id)
        } as Product;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        await fetchApi(`/products/${id}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

export async function getCustomers(): Promise<Customer[]> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
        return (data || []).map(c => ({
            ...c,
            id: String(c.id)
        })) as Customer[];
    } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
}

export async function getOrders(): Promise<Order[]> {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }

        return (data || []).map(o => ({
            ...o,
            id: String(o.id),
            date: o.created_at,
            total: Number(o.total_amount),
            customerId: String(o.customer_id)
        })) as Order[];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export async function getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items(*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    return {
        ...data,
        id: String(data.id),
        date: data.created_at,
        total: Number(data.total_amount),
        customerId: String(data.customer_id),
        items: (data.order_items || []).map((item: { id: number; product_id: number; unit_price: number }) => ({
            ...item,
            id: String(item.id),
            productId: String(item.product_id),
            unitPrice: Number(item.unit_price)
        }))
    } as Order;
}
