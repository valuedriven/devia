import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['x-tenant-id'];

        if (!tenantId) {
            // No MVP, podemos permitir um default ou lançar erro se for obrigatório
            // Por enquanto, vamos garantir que exista para fins de rastreabilidade
            request['tenantId'] = 'default-tenant';
        } else {
            request['tenantId'] = tenantId;
        }

        return next.handle();
    }
}
