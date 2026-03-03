import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto, tenantId: string) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.product.findMany({
            where: { tenantId },
            include: { category: true },
        });
    }

    async findAllActive(tenantId: string) {
        return this.prisma.product.findMany({
            where: { tenantId, status: 'active' },
            include: { category: true },
        });
    }

    async findOne(id: string, tenantId: string) {
        return this.prisma.product.findFirst({
            where: { id, tenantId },
            include: { category: true },
        });
    }

    async update(
        id: string,
        updateProductDto: Partial<CreateProductDto>,
        tenantId: string,
    ) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }

    async remove(id: string, tenantId: string) {
        const item = await this.prisma.product.findFirst({ where: { id, tenantId } });
        if (!item) return false;

        await this.prisma.product.delete({ where: { id } });
        return true;
    }
}
