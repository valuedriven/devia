import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto, tenantId: string) {
        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.category.findMany({
            where: { tenantId },
        });
    }

    async findOne(id: string, tenantId: string) {
        return this.prisma.category.findFirst({
            where: { id, tenantId },
        });
    }

    async update(
        id: string,
        updateCategoryDto: Partial<CreateCategoryDto>,
        tenantId: string,
    ) {
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: string, tenantId: string) {
        const item = await this.prisma.category.findFirst({ where: { id, tenantId } });
        if (!item) return false;

        await this.prisma.category.delete({ where: { id } });
        return true;
    }
}
