import crypto from 'crypto';
import QRCode from 'qrcode';
import { Context, Telegraf } from 'telegraf';
import { BotCommand, ParseMode, Update } from 'telegraf/typings/core/types/typegram';
import { SECOND_OF_ONE_DAY, SECOND_OF_ONE_HOUR, SECOND_OF_ONE_MINUTE, SUN_PER_TRX } from '../../lib/constants';
import { RoundNumber } from "../../lib/utils";
import { TBotTelegram, TDataContext, TDataContextAction, TDataInlineContext } from "./telegram.type";
import { TELEGRAM_BOT_TOKEN } from '../../config';
import { TReplyMarkup, TTemplate, TTemplateLanguage } from './telegram_script/type';
import { bot_script } from './telegram_script';

//TODO: Haven't found a way to get the input context yet
const convertMessageContext = (ctx: any): TDataContext => {
    const dataMessageContext: Omit<TDataContext, 'userFullName'> = {
        message: ctx.message['text'],
        messageId: ctx.message.message_id,
        userId: ctx.from.id.toString(),
        userFirstName: ctx.from?.first_name || "",
        userLastName: ctx.from?.last_name || "",
        chatId: ctx.chat.id,
        username: ctx.from?.username || "",
        chatType: ctx.message.chat.type,
        timeInSec: ctx.message.date,
        startPayload: ctx.startPayload,
        keyCommand: ctx.command,
    }
    return {
        ...dataMessageContext,
        userFullName: dataMessageContext.userFirstName + dataMessageContext.userLastName
    }
}

const convertActionContext = (ctx: any): TDataContextAction => {
    const dataContextAction: Omit<TDataContextAction, 'userFullName'> = {
        message: ctx.update.callback_query.message['text'] || "",
        messageId: ctx.update.callback_query.message?.message_id || "",
        userId: ctx.from?.id.toString() || "",
        userFirstName: ctx.from?.first_name || "",
        userLastName: ctx.from?.last_name || "",
        chatId: ctx.chat?.id || "",
        username: ctx.from?.username || "",
        chatType: ctx.update.callback_query.message?.chat.type,
        timeInSec: ctx.update.callback_query.message?.date,
        timeEditInSec: ctx.update.callback_query.message['edit_date'],
        callbackData: ctx.update.callback_query['data'] || "",
        callbackId: ctx.update.callback_query.id,
        gameShortName: ctx.update.callback_query?.game_short_name,
        gameInfo: ctx.update.callback_query.message?.game,
    }
    return {
        ...dataContextAction,
        userFullName: dataContextAction.userFirstName + dataContextAction.userLastName
    }
}


const convertInlineContext = (ctx: any): TDataInlineContext => {
    const dataContextAction: Omit<TDataInlineContext, 'userFullName'> = {
        userId: ctx.update.inline_query.from?.id.toString() || "",
        userFirstName: ctx.update.inline_query.from?.first_name || "",
        userLastName: ctx.update.inline_query.from?.last_name || "",
        username: ctx.update.inline_query.from?.username || "",
        chatType: ctx.update.inline_query.chat_type || "",
        query: ctx.update.inline_query.query || "",
    }
    return {
        ...dataContextAction,
        userFullName: dataContextAction.userFirstName + dataContextAction.userLastName
    }
}

const generateRefCode = (value: number = 7) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < value; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generateQRCodeBase64 = async (address: string) => {
    const dataQRCode = await QRCode.toDataURL(address, { width: 250, margin: 1 })
    return Buffer.from(dataQRCode.slice(22), 'base64')
}

/**
 * @param template A template string likely containing placeholders for dynamic content. 
 * @param callbackKey A key used to identify button presses for callback actions.
 * @param language Represents a language code for multilingual templates.
 * @returns An array of arrays, defining multiple rows of keyboard buttons with their text and callback data.
 */

const handMultipleInlineKeyBoard = (template: TTemplate, callbackKey: string, language?: TTemplateLanguage) => {
    const message = bot_script.template_message({ template, language });
    if (!message) return [];
    const splitMessage = message.split('_');
    const keyboardRows: { text: string; callback_data: string }[][] = [];
    splitMessage.forEach((currentValue, currentIndex) => {
        const rowIndex = Math.floor(currentIndex / 3);
        if (!keyboardRows[rowIndex]) keyboardRows[rowIndex] = [];
        keyboardRows[rowIndex].push({ text: currentValue, callback_data: `${callbackKey}&${currentValue}` });
    });
    return keyboardRows;
}

const convertBalance = (balance: number) => RoundNumber(balance / SUN_PER_TRX).floor(2)

const convertDurationToString = (timeSec: number) => timeSec / SECOND_OF_ONE_HOUR >= 24 ? `${Math.round(((timeSec / SECOND_OF_ONE_DAY) * 10) / 10)} DAYS` : `${Math.round(((timeSec / SECOND_OF_ONE_HOUR) * 10) / 10)} HOUR`

const verifyTelegramWebAppData = async (telegramInitData: string) => {
    const encoded = decodeURIComponent(telegramInitData);
    const secret = crypto.createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN);
    const arr = encoded.split('&');
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));
    const hash = arr.splice(hashIndex)[0].split('=')[1];
    arr.sort((a, b) => a.localeCompare(b));
    const dataCheckString = arr.join('\n');
    const _hash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');
    return _hash === hash;
};

const abbreviateNumber = (value: number) => {
    const suffixes = ["", "k", "m", "b", "t"];
    const base = Math.floor(Math.log10(Math.abs(value)) / 3);
    const decimal = value / Math.pow(10, base * 3);
    return `${decimal}${suffixes[base]}`;
}

const convertTimeToMDYHM = (date: Date | string | number | undefined | null) => {
    if (!date) return "TBA"
    const new_date = new Date(date).toLocaleString('en-US', { timeZone: 'UTC' }).replace(',', '')
    return new_date.slice(0, new_date.length - 11)
}

const SendMessageByBot = (bot_tele: Telegraf<Context<Update>>, chatId: string | number, message: string, optional?: {
    reply_markup?: TReplyMarkup
    parse_mode?: boolean | ParseMode
}) => {
    return bot_tele.telegram.sendMessage(chatId, message, {
        parse_mode: optional?.parse_mode ? typeof optional.parse_mode === 'boolean' ? 'Markdown' : optional.parse_mode : undefined,
        disable_web_page_preview: true,
        reply_markup: optional?.reply_markup
    })
}

const SendAnswerCbQueryByBot = async (bot_tele: Telegraf<Context<Update>>, contextId: string, message: string) => {
    await bot_tele.telegram.answerCbQuery(contextId, message, { show_alert: true })
}

const SetCommandsByBot = (bot_tele: Telegraf<Context<Update>>, data_command: BotCommand[], chat_id?: string | number) => {
    if (chat_id) {
        bot_tele.telegram.setMyCommands(data_command, { scope: { type: "chat", chat_id } })
    } else {
        bot_tele.telegram.setMyCommands(data_command)
    }
}

/**
 * @param bot_tele bot telegram
 * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
 * @param user_id Unique identifier of the target user
 * @returns boolean
 */

const isUserAccessChatByBot = async (bot_tele: TBotTelegram, chat_id: string, user_id: number) => {
    try {
        const { status } = await bot_tele.telegram.getChatMember(chat_id, user_id);
        return ["creator", "administrator", "member"].includes(status);
    } catch (error) {
        return false;
    }
}

const generateCodeVerify = (userId: string) => {
    let code: string = ''
    while (code.length < 6) {
        const number = Math.floor(Math.random() * 10)
        code += number.toString()
    }
    return `${userId}-${code}`
}

const convertTimeToString = (time_sec: number) => {
    const day = Math.floor(time_sec / SECOND_OF_ONE_DAY);
    const hour = Math.floor((time_sec - day * SECOND_OF_ONE_DAY) / SECOND_OF_ONE_HOUR);
    const minute = Math.floor((time_sec - day * SECOND_OF_ONE_DAY - hour * SECOND_OF_ONE_HOUR) / SECOND_OF_ONE_MINUTE);

    const dayStr = day > 0 ? `${day} days ` : '';
    const hourStr = hour > 0 ? `${hour} hours ` : '';
    const minuteStr = minute > 0 ? `${minute} minutes` : '';

    return `${dayStr}${hourStr}${minuteStr}`;
}

export {
    SendAnswerCbQueryByBot, SendMessageByBot, SetCommandsByBot, abbreviateNumber, convertActionContext, convertBalance,
    convertDurationToString, convertMessageContext, convertTimeToMDYHM, convertTimeToString, generateCodeVerify, generateQRCodeBase64, generateRefCode, handMultipleInlineKeyBoard,
    verifyTelegramWebAppData, convertInlineContext, isUserAccessChatByBot
};

