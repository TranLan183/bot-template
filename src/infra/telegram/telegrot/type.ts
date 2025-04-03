import { BotCommand, ForceReply, InlineKeyboardButton, InlineKeyboardMarkup, Message, ParseMode, ReplyKeyboardMarkup, ReplyKeyboardRemove, Update } from "telegraf/typings/core/types/typegram";
import { Context, Telegraf } from "telegraf"

type TTemplateLanguage = 'en' | 'zh' | 'ru' | 'vi' | 'fr' | 'id'

type TFileTemplate = {
    [template in TTemplateLanguage]?: {
        [key in string]: string
    }
}

type TCustomInlineKeyboardParams = {
    arr_message: string[]
    callback_key: string
    current_value: string
    current_index: number
    extra_callback_key: string
}

type TCustomInlineKeyboardFunction = (params: TCustomInlineKeyboardParams) => InlineKeyboardButton

type TDefaultTemplate = 'welcome' | 'error' | 'unknown_command' | 'waiting_bot' | 'full_description' | 'short_description'

type TReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined

type TDefaultReplyMarkup = {
    force_reply: () => TReplyMarkup
    error: () => TReplyMarkup
}

type TTemplateMessageConfig<GTemplate> = {
    template: GTemplate | TDefaultTemplate
    args?: object
    language?: TTemplateLanguage
}

type ELifetime = number | "long" | "medium" | "short"

type TOptionSendMessage<GTemplate> = TTemplateMessageConfig<GTemplate> & {
    reply_markup?: boolean | 'force_reply' | TReplyMarkup
    life_time?: ELifetime
    parse_mode?: boolean | ParseMode
    message_id?: number
}

type TOptionSendBufferPhoto<GTemplate> = TTemplateMessageConfig<GTemplate> & {
    parse_mode?: ParseMode,
    life_time?: number,
    source: Buffer,
    reply_markup?: boolean | 'force_reply' | TReplyMarkup
    callback: (params: Message.PhotoMessage) => void
}

type TOptionSendUrlPhoto<GTemplate> = TTemplateMessageConfig<GTemplate> & {
    parse_mode?: ParseMode,
    life_time?: number,
    url: string,
    reply_markup?: boolean | 'force_reply' | TReplyMarkup
    callback: (params: Message.PhotoMessage) => void
}

type TInputMultipleInlineKeyboard<GTemplate> = Partial<TTemplateMessageConfig<GTemplate>> & {
    callback_key: string
    number_btn_row?: number
    message_data?: string
    extra_callback_key?: string
}

type TPaginationInlineKeyboardParams = {
    page: number
    page_size: number
    total_data: number
    callback_key: string
    use_time_refresh?: boolean
    use_infinity?: boolean
}

type TCallbackData = {
    [key in string]: string
}

type TOptionSendAnswerCbQuery<GTemplate> = TTemplateMessageConfig<GTemplate> & {
    show_alert?: boolean
    url?: string
    cache_time?: number
}

interface IEntitiesMessage {
    setBoldMessage: (message: string) => string;
    setItalicMessage: (message: string) => string;
    setCodeMessage: (message: string) => string;
    setMonoSpaceMessage: (message: string) => string;
    setUnderlineMessage: (message: string) => string;
    setSpoilerMessage: (message: string) => string;
    setStrikeMessage: (message: string) => string;
    setTextUrlMessage: (message: string, url: string, toShort?: boolean) => string;
}


type TTemplateMessage<GTemplate> = (parameters: TTemplateMessageConfig<GTemplate>) => string;

interface ITelegramBotTemplate<GReplyMarkup, GTemplate> {
    default_language: TTemplateLanguage;
    entities_message: IEntitiesMessage;
    template_message: TTemplateMessage<GTemplate>
    reply_markup: () => GReplyMarkup
    file_template: TFileTemplate
}

interface ITelegramBotInlineKeyword<GTemplate> {
    handleMultipleInlineKeyBoard: (parameters: TInputMultipleInlineKeyboard<GTemplate>) => InlineKeyboardButton[][],
    handlePaginationInlineKeyBoard: (parameters: TPaginationInlineKeyboardParams) => InlineKeyboardButton[]
}

interface ITelegramConfig<GReplyMarkup, GTemplate> extends ITelegramBotTemplate<GReplyMarkup, GTemplate> {
    all_commands: (language?: TTemplateLanguage) => BotCommand[]
}


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
    isBot: boolean
    isPremium: boolean
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

type TCacheDataUser = {
    user_step: string
    language: TTemplateLanguage
    message_id?: number
}

type TCacheDataUserNotify = Omit<TCacheDataUser, 'time_query_history'>

type TBotTelegram = Telegraf<Context<Update>>

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


type TSendMessageError = TTelegramError & {
    use_reply_markup?: boolean
    use_lifetime?: boolean
    error_key: string
    context_id: string
}

type TTeleErrorList = {
    [key in string]: string
}

type TGenerateStartPayloadLink = {
    jetton?: string
    ref_code?: string
    limit_order_id?: string
    copy_limit_order_id?: string
    snipe_order_id?: string
}

type TTelegramBotInitParams<GReplyMarkup, GTemplate> = {
    bot_name: string
    bot_token: string
    is_enable: boolean
    bot_error_list: TTeleErrorList[]
    bot_config: ITelegramConfig<GReplyMarkup, GTemplate>
}

type TTelegramBotInitOptions = {
    is_set_description?: boolean
    is_use_local_telegram?: boolean
    local_telegram_url?: string
    is_use_webhook?: boolean
    webhook_url?: string
    webhook_port?: number
    delay_bot_start?: number
}

export {
    ELifetime, IEntitiesMessage, ITelegramBotInlineKeyword, ITelegramBotTemplate, ITelegramConfig, TBotTelegram, TCacheDataUser, TCacheDataUserNotify, TCallbackData, TCustomInlineKeyboardFunction, TCustomInlineKeyboardParams, TDataContext, TDataContextAction, TDataInlineContext, TDataPagination, TDefaultReplyMarkup, TFileTemplate, TGenerateStartPayloadLink, TInputMultipleInlineKeyboard, TOptionSendAnswerCbQuery, TOptionSendBufferPhoto, TOptionSendMessage, TOptionSendUrlPhoto, TPaginationInlineKeyboardParams, TReplyMarkup, TSendMessageError, TTeleErrorList, TTelegramBotInitOptions, TTelegramBotInitParams, TTelegramError, TTemplateLanguage, TTemplateMessage, TTemplateMessageConfig
};