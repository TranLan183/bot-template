import crypto from 'crypto'
import { TBotTelegram, TDataContext, TDataContextAction, TDataInlineContext, TDataPagination, TGenerateStartPayloadLink } from './type'
import { readableNumber } from '../beauty_number'
import { SECOND_OF_ONE_DAY, SECOND_OF_ONE_HOUR, SECOND_OF_ONE_MINUTE, SUN_PER_TRX } from '../constants'

const convertMessageContext = (ctx: any): TDataContext => {
    const dataMessageContext: Omit<TDataContext, 'userFullName'> = {
        message: ctx.message['text'],
        messageId: ctx.message.message_id,
        userId: ctx.from.id.toString(),
        userFirstName: ctx.from?.first_name || "",
        userLastName: ctx.from?.last_name || "",
        chatId: ctx.chat.id, //group or channel id
        username: ctx.from?.username || "",
        languageCode: ctx.from?.language_code,
        isPremium: ctx.from?.is_premium || false,
        isBot: ctx.from?.is_bot || false,
        chatType: ctx.message.chat.type,
        timeInSec: ctx.message.date,
        startPayload: ctx.startPayload,
        keyCommand: ctx.command,
        migrateToChatId: ctx.message.migrate_to_chat_id,
        leftChatMember: ctx.message.left_chat_member,
        chatTitle: ctx.message.chat.title,
        newChatTitle: ctx.message.new_chat_title,
        replyToMessageId: ctx.message?.reply_to_message?.message_id
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
        isPremium: ctx.from?.is_premium || false,
        isBot: ctx.from?.is_bot || false,
        chatId: ctx.chat?.id || "",
        username: ctx.from?.username || "",
        languageCode: ctx.from?.language_code,
        chatType: ctx.update.callback_query.message?.chat.type,
        timeInSec: ctx.update.callback_query.message?.date,
        timeEditInSec: ctx.update.callback_query.message['edit_date'],
        callbackData: ctx.update.callback_query['data'] || "",
        callbackId: ctx.update.callback_query.id,
        gameShortName: ctx.update.callback_query?.game_short_name,
        gameInfo: ctx.update.callback_query.message?.game,
        inlineKeyboard: ctx.update.callback_query.message?.reply_markup?.inline_keyboard
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
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < value; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

// const generateQRCodeBase64 = async (address: string) => {
//     const dataQRCode = await QRCode.toDataURL(address, { width: 250, margin: 1 })
//     return Buffer.from(dataQRCode.slice(22), 'base64')
// }


const convertBalanceByChain = (balance: number | string, chain: "TON" | "TRON" | 'TOKEN', decimal: string | number = 6) => {
    switch (chain) {
        case 'TON':
            return readableNumber((Number(balance) / (10 ** Number(9))).toString())
        case 'TRON':
            return readableNumber((Number(balance) / SUN_PER_TRX).toString())
        case 'TOKEN':
            return readableNumber((Number(balance) / (10 ** Number(decimal))).toString())
    }
}

const convertDurationToString = (timeSec: number) => timeSec / SECOND_OF_ONE_HOUR >= 24 ? `${Math.round(((timeSec / SECOND_OF_ONE_DAY) * 10) / 10)} DAYS` : `${Math.round(((timeSec / SECOND_OF_ONE_HOUR) * 10) / 10)} HOUR`

const convertAddressShortCut = (address: string, start: number = 0, end: number = -4) => address.replace(address.slice(start, end), '.')

const verifyTelegramWebAppData = async (telegramInitData: string, teleBotToken: string) => {
    const encoded = decodeURIComponent(telegramInitData)
    const secret = crypto.createHmac('sha256', 'WebAppData').update(teleBotToken)
    const arr = encoded.split('&')
    const hashIndex = arr.findIndex(str => str.startsWith('hash='))
    const hash = arr.splice(hashIndex)[0].split('=')[1]
    arr.sort((a, b) => a.localeCompare(b))
    const dataCheckString = arr.join('\n')
    const _hash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex')
    return _hash === hash
}

const convertTimeToMDYHM = (date: Date | string | number | undefined | null) => {
    if (!date) return "TBA"
    const new_date = new Date(date).toLocaleString('en-US', { timeZone: 'UTC' }).replace(',', '')
    return new_date.slice(0, new_date.length - 11)
}

/**
 * @param bot_tele bot telegram
 * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`)
 * @param user_id Unique identifier of the target user
 * @returns boolean
 */

const isUserAccessChatByBot = async (bot_tele: TBotTelegram, chat_id: string, user_id: number) => {
    try {
        const { status } = await bot_tele.telegram.getChatMember(chat_id, user_id)
        return ["creator", "administrator", "member"].includes(status)
    } catch (error) {
        return false
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
    const day = Math.floor(time_sec / SECOND_OF_ONE_DAY)
    const hour = Math.floor((time_sec - day * SECOND_OF_ONE_DAY) / SECOND_OF_ONE_HOUR)
    const minute = Math.floor((time_sec - day * SECOND_OF_ONE_DAY - hour * SECOND_OF_ONE_HOUR) / SECOND_OF_ONE_MINUTE)

    const dayStr = day > 0 ? `${day} days ` : ''
    const hourStr = hour > 0 ? `${hour} hours ` : ''
    const minuteStr = minute > 0 ? `${minute} minutes` : ''

    return `${dayStr}${hourStr}${minuteStr}`
}

const generateStartPayloadLink = (params: TGenerateStartPayloadLink, tele_bot_name: string) => {
    const { jetton, ref_code, limit_order_id, copy_limit_order_id, snipe_order_id } = params
    if (jetton && ref_code) return `https://t.me/${tele_bot_name}?start=b_${jetton}_r_${ref_code}`
    if (!jetton && ref_code) return `https://t.me/${tele_bot_name}?start=r_${ref_code}`
    if (jetton && !ref_code) return `https://t.me/${tele_bot_name}?start=b_${jetton}`
    if (limit_order_id) return `https://t.me/${tele_bot_name}?start=l_${limit_order_id}`
    if (copy_limit_order_id) return `https://t.me/${tele_bot_name}?start=c_${copy_limit_order_id}`
    if (snipe_order_id) return `https://t.me/${tele_bot_name}?start=s_${snipe_order_id}`
    return `https://t.me/${tele_bot_name}`
}

const handleDataForPagination = <T>(data: T[], current_page: number = 0) => {
    let defaultData: TDataPagination<T> = {
        page: 0,
        page_size: 0,
        new_data_wallet: data,
        total_data: data.length
    }
    if (data.length > 8) {
        defaultData.page_size = 4
        defaultData.page = current_page
        defaultData.new_data_wallet = data.slice(current_page * defaultData.page_size, (current_page + 1) * defaultData.page_size)
    }
    return defaultData
}

const calculateCurrentPage = (index: number, total_data: number, page_size: number = 4) => {
    return total_data > 8 ? Math.floor((index) / page_size) : 0
}

const substr_address = (address: string) => {
    return address.slice(0, 3) + '...' + address.slice(-4, address.length)
}

const removeDuplicates = (array: string[]) => {
    return Array.from(new Set(array))
}

type TPayloadParams = {
    ref_code?: string
    jetton?: string
    limit_order_id?: string
    snipe_order_id?: string
    copy_ref_id?: string
}

const getParamsFromPayload = (payload?: string): TPayloadParams => {
    if (!payload) return {
        ref_code: undefined,
        jetton: undefined,
        limit_order_id: undefined,
        snipe_order_id: undefined,
        copy_ref_id: undefined,
    }
    const op = payload.substring(0, 2)
    const _payload = payload.substring(2, payload.length)
    switch (op) {
        case "b_":
            if (_payload.includes("_r_")) {
                return {
                    ref_code: _payload.split("_r_")[1],
                    jetton: _payload.split("_r_")[0]
                }
            } else return {
                ref_code: undefined,
                jetton: _payload
            }
        case "r_":
            return {
                ref_code: _payload,
                jetton: undefined
            }
        case "l_":
            return {
                limit_order_id: _payload,
            }
        case "s_":
            return {
                snipe_order_id: _payload,
            }
        case "c_":
            if (_payload.includes("_r_")) {
                return {
                    ref_code: _payload.split("_r_")[1],
                    copy_ref_id: _payload.split("_r_")[0]
                }
            } else return {
                copy_ref_id: _payload,
            }
        default:
            return {
                ref_code: payload,
                jetton: undefined
            }
    }
}

const GetAddressOrLinkFromMessage = (message: string) => {
    const regex = new RegExp("(https:\/\/www.geckoterminal.com\/(|[a-zA-Z]{2}\/)ton\/pools\/|https:\/\/dexscreener.com\/ton\/|)((0|-1):([a-f0-9]{64}|[A-F0-9]{64})|(E|U|e|u|k|0)([^\n \/:]){47})")
    return regex.exec(message)
}

export {
    calculateCurrentPage, convertActionContext, convertAddressShortCut, convertBalanceByChain,
    convertDurationToString, convertInlineContext, convertMessageContext, convertTimeToMDYHM, convertTimeToString, generateCodeVerify,
    generateRefCode, generateStartPayloadLink, GetAddressOrLinkFromMessage, getParamsFromPayload, handleDataForPagination, isUserAccessChatByBot, removeDuplicates, substr_address, verifyTelegramWebAppData
}

