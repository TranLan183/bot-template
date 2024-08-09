import { Steps, tele_bot } from "../.."
import { ErrorHandler } from "../../../../../lib/error_handler"
import { ConvertTeleError } from "../../../telegram.error"
import { TCacheDataUser, TDataContext } from "../../../telegram.type"
import { bot_script } from "../../../telegram_script"
import { TTemplateLanguage } from "../../../telegram_script/type"
import { verify_default_handler } from "../../telegram_verify/verify.default_handler"
import { verify_finish_handle } from "../../telegram_verify/verify.finish_handle"
import en from '../../../telegram_template/en.json';

const isButtonMessage = (message: string, language?: TTemplateLanguage) => {
    return [''].includes(message) || message.startsWith('/')
}

const messageActionKeyBoard = async (dataMessageContext: TDataContext, language?: TTemplateLanguage) => {
    const { message, chatId, userId, userFirstName, username, userFullName } = dataMessageContext
    switch (message) {

        default:
            if (message.startsWith('/')) verify_default_handler(dataMessageContext, language)
            break
    }
}

const messageVerifyStep = async (dataMessageContext: TDataContext, user_storage: TCacheDataUser) => {
    const { message, userId, chatId } = dataMessageContext
    const { user_step, language } = user_storage
    try {
        switch (user_step) {
            case Steps.finish:
                if (!Object.values({ ...en, }).includes(message)) await verify_finish_handle(dataMessageContext, language)
                break
            default:
                if (!message.startsWith('/')) await verify_default_handler(dataMessageContext, language)
                break
        }
    } catch (error) {
        ErrorHandler(error, { message, userId, chatId }, messageVerifyStep.name)
        ConvertTeleError(error, tele_bot, chatId, language)
    }
}

export const handlePrivateChat = async (dataMessageContext: TDataContext, user_storage: TCacheDataUser) => {
    const { userId, chatId, message } = dataMessageContext
    const { language } = user_storage
    try {
        if (isButtonMessage(message, language)) {
            await messageActionKeyBoard(dataMessageContext, language)
        } else {
            await messageVerifyStep(dataMessageContext, user_storage)
        }
    } catch (e: any) {
        ErrorHandler(e, { chatId, userId }, handlePrivateChat.name)
        ConvertTeleError(e, tele_bot, chatId, language)
    }
}
