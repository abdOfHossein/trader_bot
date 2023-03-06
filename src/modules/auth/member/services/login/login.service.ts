import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CacheKeys } from '../../enums/cache-keys.enum'

export abstract class LoginService
{
    getCacheKeyOTPVerification(mobileNumber: string, countryCode?: string): string
    {
        return `${ CacheKeys.VeificationCode }_${ countryCode || '' }${ mobileNumber }`
    }

    tokenDataOTPVerification(level, data: { countryCode: string, mobileNumber: string, code: string }): string
    {
        return `${ level }-${ data.countryCode }-${ data.mobileNumber }-${ data.code }`
    }

    tokenDataOTPCreationAccount(level, data: { countryCode: string, mobileNumber: string }): string
    {
        return `${ level }-${ data.countryCode }-${ data.mobileNumber }`
    }

    generateToken(data: string): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            bcrypt.genSalt(10, function(err, salt)
            {
                if (err) reject(err)
                bcrypt.hash(data, salt, function(err, hash)
                {
                    if (err) reject(err)
                    resolve(hash)
                })
            })
        })
    }
}