import { Body, Controller, Get, OnModuleInit, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { IdBodyRequest } from 'src/modules/api/dtos/id.body.request.dto'
import { IdQueryRequestDTO } from 'src/modules/api/dtos/id.query.request.dto'
import { PaginatedRequestDTO } from 'src/modules/api/dtos/paginated.request.dto'
import { PaginatedResponseInterceptor } from 'src/modules/api/interceptors/paginated.response.interceptor'
import { SuccessStatusWithDataResponseInterceptor } from 'src/modules/api/interceptors/success-status-with-data.response.interceptor'
import { SuccessStatusResponseInterceptor } from 'src/modules/api/interceptors/success-status.response.interceptor'
import { PaginatedModel } from 'src/modules/api/models/paginated.model'
import { ManagerialAccessTokenJwtAuthGuard } from 'src/modules/auth/managerial/guards/managerial.access-token.jwt.auth.guard'
import { ThrottlerBehindProxyGuard } from 'src/modules/global/guards/throttler-behind-proxy.guard'
import { AccountMemberCreateRequestDTO } from '../dtos/account.member.create.request.dto'
import { AccountMemberUpdateRequestDTO } from '../dtos/account.member.update.request.dto'
import { AccountMemberModel } from '../models/account-member.model'
import { AccountManagementManagerialService } from './account-management.managerial.service'
import { AccountManagerialPasswordUpdateRequestDTO } from './dtos/account.managerial.password.update.request.dto'
import { AccountManagerialUpdateRequestDTO } from './dtos/account.managerial.update.request.dto'
@ApiTags('Account Management')
@ApiBearerAuth()
@Controller('account-management/managerial')
@UseGuards(ThrottlerBehindProxyGuard, ManagerialAccessTokenJwtAuthGuard)
export class AccountManagementManagerialController implements OnModuleInit {
    constructor(private readonly accountManagementManagerialService: AccountManagementManagerialService) { }

    onModuleInit() {
        this.accountManagementManagerialService.checkAdminAccountIsExists()
        this.accountManagementManagerialService.getBlockedAccounts()
    }

    @UseInterceptors(SuccessStatusWithDataResponseInterceptor)
    @Get('profile')
    getProfile(@Req() request: Request) {
        return this.accountManagementManagerialService.getProfile(request.user['id'])
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put('profile')
    updateProfile(@Req() request: Request, @Body() accountManagerialUpdateRequestDTO: AccountManagerialUpdateRequestDTO) {
        return this.accountManagementManagerialService.updateProfile(accountManagerialUpdateRequestDTO, request.user['id'])
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put('profile/password')
    updatePassword(@Req() request: Request, @Body() accountManagerialPasswordUpdateRequestDTO: AccountManagerialPasswordUpdateRequestDTO) {
        return this.accountManagementManagerialService.updatePassword(accountManagerialPasswordUpdateRequestDTO, request.user['id'])
    }

    @UseInterceptors(PaginatedResponseInterceptor<AccountMemberModel, PaginatedModel<AccountMemberModel>>)
    @Get('list/member')
    getAllMembers(@Query() data: PaginatedRequestDTO) {
        return this.accountManagementManagerialService.getAllMembers(data)
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Post('member')
    createMember(@Body() body: AccountMemberCreateRequestDTO) {
        return this.accountManagementManagerialService.create(body)
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put('member')
    updateMember(@Query() query: IdQueryRequestDTO, @Body() body: AccountMemberUpdateRequestDTO) {
        return this.accountManagementManagerialService.update(body, query.id)
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put('member/block')
    blockMember(@Body() body: IdBodyRequest) {
        return this.accountManagementManagerialService.block(body.id)
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put('member/unblock')
    unblockMember(@Body() body: IdBodyRequest) {
        return this.accountManagementManagerialService.unblock(body.id)
    }
}