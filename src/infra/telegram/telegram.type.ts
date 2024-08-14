import { Context, NarrowedContext, Telegraf } from "telegraf"
import { TTemplateLanguage } from "./telegram_script/type"
import { InlineKeyboardButton, Message, Update } from "telegraf/types"

type TChatMember = {
    id: number
    is_bot: boolean
    first_name?: string,
    last_name?: string,
    username?: string
    language_code?: string
}
type TDataContext = {
    message: string
    messageId: number
    userId: string
    userFirstName: string
    userLastName: string
    userFullName: string
    languageCode: string
    chatId: number
    username: string
    chatType: "group" | "supergroup" | "private" | "channel"
    timeInSec: number
    startPayload?: string
    keyCommand?: string
    migrateToChatId?: number
    newChatMember?: TChatMember,
    leftChatMember?: TChatMember,
    chatTitle?: string
    newChatTitle?: string,
    replyToMessageId?: number
}

type TDataContextAction = TDataContext & {
    timeEditInSec: number
    callbackData: string
    callbackId: string
    gameShortName?: string
    gameInfo?: object
    inlineKeyboard?: InlineKeyboardButton[][]
}

type TDataInlineContext = {
    userId: string
    userFirstName: string
    userLastName: string
    userFullName: string
    username: string
    chatType: string
    query: string
}

type TActionContext = NarrowedContext<Context, Update.CallbackQueryUpdate>
type TMessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>

type TCacheDataUser = {
    user_step: string
    language: TTemplateLanguage
    message_id?: number
}

type TAgencyData = {
    bot_id: string
    link_address: string,
    agency_id: string
}

type TCacheDataUserNotify = Omit<TCacheDataUser, 'time_query_history'>

type TBotTelegram = Telegraf<Context<Update>>

type TDataOrderBook = {
    min: number,
    max: number,
    value: number
}

type TDataPagination<T> = {
    page: number,
    page_size: number,
    new_data_wallet: T[],
    total_data: number
}

type TTelegramError = {
    context_id: string | number
    args?: object
    language?: TTemplateLanguage
    message_id?: number
}

type TErrorKey = string

type TSendMessageError = TTelegramError & {
    use_reply_markup?: boolean
    use_lifetime?: boolean
    error_key: TErrorKey
    context_id: string
}

type TTeleErrorList = string

type TGenerateStartPayloadLink = {
    jetton?: string
    ref_code?: string
    limit_order_id?: string
    copy_limit_order_id?: string
    snipe_order_id?: string
}

export {
    TActionContext, TCacheDataUser, TDataContext, TDataContextAction, TDataOrderBook, TMessageContext, TCacheDataUserNotify, TAgencyData, TDataInlineContext, TBotTelegram, TTelegramError, TSendMessageError, TTeleErrorList, TErrorKey, TDataPagination, TGenerateStartPayloadLink
}
