import { BotCommand, ForceReply, InlineKeyboardMarkup, Message, ParseMode, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "telegraf/typings/core/types/typegram";
import { TelegramBotTemplate, file_template } from "./template";
import { TBotTelegram } from "../telegram.type";

type TTemplateLanguage = keyof typeof file_template
type TTemplate = keyof typeof file_template.en | keyof typeof file_template.scan_bot_en | keyof typeof file_template.buy_noti_bot_en

type TReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined
type TTemplateMessageConfig = { template: TTemplate, bot_id?: string, args?: object, language?: TTemplateLanguage }


type TOptionSendMessage = TTemplateMessageConfig & {
    reply_markup?: boolean | 'force_reply' | TReplyMarkup
    life_time?: number | "long" | "medium" | "short"
    parse_mode?: boolean | ParseMode
    message_id?: number
}

type TOptionSendBufferPhoto = {
    parse_mode?: ParseMode,
    life_time?: number,
    caption: string,
    source: Buffer,
    reply_markup?: TReplyMarkup
    callback: (params: Message.PhotoMessage) => void
}

type TOptionSendUrlPhoto = {
    parse_mode?: ParseMode,
    life_time?: number,
    caption: string,
    url: string,
    reply_markup?: TReplyMarkup
    callback: (params: Message.PhotoMessage) => void
}

type TInputMultipleInlineKeyboard = Partial<TTemplateMessageConfig> & {
    callback_key: string
    number_btn_row?: number
    message_data?: string
    extra_callback_key?: string
}

type TOptionSendAnswerCbQuery = TTemplateMessageConfig & {
    show_alert?: boolean
    url?: string
    cache_time?: number
}

interface IMessageEntities {
    setBoldMessage: (message: string) => string;
    setItalicMessage: (message: string) => string;
    setCodeMessage: (message: string) => string;
    setMonoSpaceMessage: (message: string) => string;
    setUnderlineMessage: (message: string) => string;
    setSpoilerMessage: (message: string) => string;
    setStrikeMessage: (message: string) => string;
    setTextUrlMessage: (message: string, url: string, toShort?: boolean) => string;
}


type TTemplateMessage = (parameters: TTemplateMessageConfig) => string;

interface ITelegramBotTemplate {
    bot_id?: string;
    default_language: TTemplateLanguage;
    message_entities: IMessageEntities;
    template_message: TTemplateMessage
}

interface ITelegramConfig<T> extends TelegramBotTemplate {
    bot_tele: TBotTelegram
    reply_markup: (language?: TTemplateLanguage) => T
    all_commands: (language?: TTemplateLanguage) => BotCommand[]
}

export {
    ITelegramBotTemplate, ITelegramConfig, TInputMultipleInlineKeyboard, TOptionSendAnswerCbQuery, TOptionSendBufferPhoto, TOptionSendMessage, TOptionSendUrlPhoto, TReplyMarkup, TTemplate,
    TTemplateLanguage, TTemplateMessage, TTemplateMessageConfig
};
