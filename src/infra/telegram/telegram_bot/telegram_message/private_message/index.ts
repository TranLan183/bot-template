import { TDataContext } from "../../../../../lib/telegram/type";
import { TTemplateLanguage } from "../../../../../lib/telegram/type";
import { bot_template } from "../../index";
import { TUserSetting } from "../../telegram_cache/cache.data_user";

export const BotTradingSteps = {
    welcome: "welcome",
    finish: "finish",
}

const isButtonMessage = (message: string, language?: TTemplateLanguage) => {
    return [''].includes(message) || message.startsWith('/')
}

const messageActionKeyBoard = async (dataMessageContext: TDataContext, language?: TTemplateLanguage) => {
    const { message, chatId, userId, userFirstName, username, userFullName } = dataMessageContext
    const { ConvertTeleError, bot_script } = bot_template
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

const messageVerifyStep = async (dataMessageContext: TDataContext, dataUserSetting: TUserSetting) => {
    const { message, userId, chatId } = dataMessageContext
    const { user_step, language } = dataUserSetting
    const { ConvertTeleError, bot_script } = bot_template
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

export const handlePrivateChat = async (dataMessageContext: TDataContext, dataUserSetting: TUserSetting) => {
    const { userId, chatId, message } = dataMessageContext
    const { language } = dataUserSetting
    const { ConvertTeleError } = bot_template
    try {
        if (isButtonMessage(message, language)) {
            await messageActionKeyBoard(dataMessageContext, language)
        } else {
            await messageVerifyStep(dataMessageContext, dataUserSetting)
        }
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, handlePrivateChat.name)
    }
}
