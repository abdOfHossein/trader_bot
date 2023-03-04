import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import {
  AccountsSubscriptions,
  AccountsSubscriptionsDocument,
} from '../../../database/mongoose/schema/subscription/accounts-subscriptions.schema';
import { I18nTranslations } from '../../../generated/i18n.generated';

@Injectable()
export class MemberSubscriptionAuthGuard implements CanActivate {
  constructor(
    @InjectModel(AccountsSubscriptions.name)
    private readonly accountsSubscriptionsModel: Model<AccountsSubscriptionsDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean |any> {
    const request = context.switchToHttp().getRequest() as Request;
    // return await this.handleRequestAndCheckUserHasSubscription(request.user);
  }

  async handleRequestAndCheckUserHasSubscription(user) {
    const i18n = I18nContext.current<I18nTranslations>();
    // You can throw an exception based on either "info" or "err" arguments
    if (!user) throw new UnauthorizedException(i18n.t('errors.unauthorized'));

    const hasSubscription = !!(await this.accountsSubscriptionsModel.findOne({
      $and: [
        { account: { $in: [user.id] } },
        { startedAt: { $lte: new Date() } },
        { expiredAt: { $gt: new Date() } },
      ],
    }));

    if (!hasSubscription)
      throw new ForbiddenException(
        i18n.t(
          'auth.errors.to_use_the_service_please_prepare_our_monthly_subscription_first_thanks',
        ),
      );

    return true;
  }
}
