import { Context, NarrowedContext } from "telegraf/typings/context"
import { Message, Update } from "telegraf/typings/core/types/typegram"
import { Telegraf } from "telegraf"
import { TTemplateLanguage } from "./telegram_template/type"

type TDataContext = {
    message: string
    messageId: number
    userId: string
    userFirstName: string
    userLastName: string
    userFullName: string
    chatId: number
    username: string
    chatType: string
    timeInSec: number
    startPayload?: string
    keyCommand?: string
}

type TDataContextAction = TDataContext & {
    timeEditInSec: number
    callbackData: string
    callbackId: string
    gameShortName?: string
    gameInfo?: object
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

export {
    TActionContext, TCacheDataUser, TDataContext, TDataContextAction, TDataOrderBook, TMessageContext, TCacheDataUserNotify, TAgencyData, TDataInlineContext, TBotTelegram
}
