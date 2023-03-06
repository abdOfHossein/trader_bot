import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { PaginatedResponseDto } from '../dtos/paginated.response.dto'
import { PublicResponseDTO } from '../dtos/public.response.dto'
import { StatusesResponseEnum } from '../enums/statuses.response.enum'

@Injectable()
export class SuccessStatusResponseInterceptor
{
    intercept(_: ExecutionContext, next: CallHandler): Observable<PublicResponseDTO>
    {
        return next.handle().pipe(map(() =>
        {
            const response = new PublicResponseDTO()

            response.status = StatusesResponseEnum.Success

            return response
        }))
    }
}