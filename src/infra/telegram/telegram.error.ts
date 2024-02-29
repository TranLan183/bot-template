import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { SendAnswerCbQueryByBot, SendMessageByBot } from "./telegram.lib";
import { bot_script } from "./telegram_template";
import { TTemplate, TTemplateLanguage } from "./telegram_template/type";

type TTeleErrorList = keyof typeof TeleErrorList

export const TeleErrorList = {
    'RLS:212 ADDRESS_INVALID': "ADDRESS_INVALID",
    'RLS:233 USER_TELE_NOT_FOUND': 'USER_TELE_NOT_FOUND',
    'RLS:234 INVALID_CACHE_ORDER_IN_TELE': "INVALID_CACHE_ORDER_IN_TELE",
    'RLS:235 INVALID_CACHE_USER_STORAGE_IN_TELE': "INVALID_CACHE_USER_STORAGE_IN_TELE",
    'RLS:236 USER_REF_NOT_FOUND': "USER_REF_NOT_FOUND",
    'RLS:237 CONTACT_NOT_EXISTS': "CONTACT_NOT_EXISTS",
    'RLS:443 INVALID_USERNAME_TELEGRAM': "INVALID_USERNAME_TELEGRAM",
    'RLS:448 AMOUNT_ENERGY_TOO_LOW': "AMOUNT_ENERGY_TOO_LOW",
    'RLS:213 DURATION_INVALID': "DURATION_INVALID",
    'RLS:243 PENDING_ORDER_ALREADY_EXIST': "PENDING_ORDER_ALREADY_EXIST",
    'RLS:244 PENDING_ORDER_NOT_EXIST': "PENDING_ORDER_NOT_EXIST",
    'RLS:449 RESOURCE_INVALID': "RESOURCE_INVALID",
    'RLS:450 CALCULATE_INVALID_ARGUMENTS': "CALCULATE_INVALID_ARGUMENTS",
    'RLS:451 ENERGY_INVALID_ARGUMENTS': "ENERGY_INVALID_ARGUMENTS",
    'RLS:452 CHANGE_LANGUAGE_INVALID_ARGUMENTS': "DETAIL_ALL_LANGUAGE",
    'RLS:453 COMMAND_INVALID_ARGUMENTS': "COMMAND_INVALID_ARGUMENTS",
}

const handleSendMessageError = async (bot_tele: Telegraf<Context<Update>>, contextId: string, errorKey: TTeleErrorList, args?: object, language?: TTemplateLanguage) => {
    const convertErrKey = errorKey.toLowerCase() as TTemplate
    const message = bot_script.template_message({ template: convertErrKey, args, language })
    return contextId.length < 19 ? await SendMessageByBot(bot_tele, contextId, message) : await SendAnswerCbQueryByBot(bot_tele, contextId, message)
}

// contextId: callbackID || chatId
export const ConvertTeleError = async (e: any, bot_tele: Telegraf<Context<Update>>, contextId: string | number, language?: TTemplateLanguage) => {
    const message = e.message as string
    if (!TeleErrorList[message]) {
        await handleSendMessageError(bot_tele, contextId.toString(), 'error' as TTeleErrorList, undefined, language)
    } else {
        await handleSendMessageError(bot_tele, contextId.toString(), TeleErrorList[message], undefined, language)
    }
    return
}