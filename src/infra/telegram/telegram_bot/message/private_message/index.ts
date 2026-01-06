import { Context } from "telegraf";
import { TDataContext, TTemplateLanguage } from "../../../../../lib/telegram/type";
import { convertMessageContext } from "../../../../../lib/telegram/utils";
import { TUserSetting } from "../../cache/cache.data_user";
import { BotTemplateServiceType } from "../../type";

export const BotTradingSteps = {
    welcome: "welcome",
    finish: "finish",
}

const isButtonMessage = (message: string, language?: TTemplateLanguage) => {
    return [''].includes(message) || message.startsWith('/')
}

const messageActionKeyBoard = async (dataMessageContext: TDataContext, bot_method: BotTemplateServiceType, dataUserSetting: TUserSetting) => {
    const { message, chatId, userId, userFirstName, username, userFullName } = dataMessageContext
    const { ConvertTeleError, bot_script } = bot_method
    const { language } = dataUserSetting
    try {
        switch (message) {

            default:
                if (message.startsWith('/')) bot_script.sendMessage(chatId, { template: 'unknown_command', language })
                break
        }
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, messageActionKeyBoard.name)
    }
}

const messageVerifyStep = async (dataMessageContext: TDataContext, bot_method: BotTemplateServiceType, dataUserSetting: TUserSetting) => {
    const { message, userId, chatId } = dataMessageContext
    const { user_step, language } = dataUserSetting
    const { ConvertTeleError, bot_script } = bot_method
    try {
        switch (user_step) {
            default:
                if (!message.startsWith('/')) await bot_script.sendMessage(chatId, { template: 'unknown_command', language })
                break
        }
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, messageVerifyStep.name)
    }
}

export const handlePrivateChat = async (ctx: Context, bot_method: BotTemplateServiceType, dataUserSetting: TUserSetting) => {
    const dataMessageContext = convertMessageContext(ctx)
    const { message, chatId } = dataMessageContext
    const { language } = dataUserSetting
    const { ConvertTeleError } = bot_method
    try {
        if (isButtonMessage(message, language)) {
            await messageActionKeyBoard(dataMessageContext, bot_method, dataUserSetting)
        } else {
            await messageVerifyStep(dataMessageContext, bot_method, dataUserSetting)
        }
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, handlePrivateChat.name)
    }
}
