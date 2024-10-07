import { BotCommand, ForceReply, InlineKeyboardMarkup, Message, ParseMode, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "telegraf/typings/core/types/typegram";
import { TelegramBotTemplate } from "./template";
import { TBotTelegram } from "../telegram.type";

type TTemplateLanguage = 'en' | 'zh' | 'ru' | 'vi' | 'fr' | 'id'

type TFileTemplate = {
    [template in TTemplateLanguage]?: {
        [key in string]: string
    }
}

type TDefaultTemplate = 'welcome' | 'error' | 'unknown_command' | 'waiting_bot' | 'full_description' | 'short_description'

type TReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined

type TTemplateMessageConfig<GTemplate> = {
    template: GTemplate | TDefaultTemplate
    args?: object
    language?: TTemplateLanguage
}


type TOptionSendMessage<GTemplate> = TTemplateMessageConfig<GTemplate> & {
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

type TInputMultipleInlineKeyboard<GTemplate> = Partial<TTemplateMessageConfig<GTemplate>> & {
    callback_key: string
    number_btn_row?: number
    message_data?: string
    extra_callback_key?: string
}

type TOptionSendAnswerCbQuery<GTemplate> = TTemplateMessageConfig<GTemplate> & {
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


type TTemplateMessage<GTemplate> = (parameters: TTemplateMessageConfig<GTemplate>) => string;

interface ITelegramBotTemplate<GTemplate> {
    default_language: TTemplateLanguage;
    message_entities: IMessageEntities;
    template_message: TTemplateMessage<GTemplate>
}

interface ITelegramConfig<GReplyMarkup, GTemplate> extends TelegramBotTemplate<GTemplate> {
    bot_tele: TBotTelegram
    reply_markup: (language?: TTemplateLanguage) => GReplyMarkup
    all_commands: (language?: TTemplateLanguage) => BotCommand[]
}

export {
    ITelegramBotTemplate, ITelegramConfig, TInputMultipleInlineKeyboard, TOptionSendAnswerCbQuery, TOptionSendBufferPhoto, TOptionSendMessage, TOptionSendUrlPhoto, TReplyMarkup,
    TTemplateLanguage, TTemplateMessage, TTemplateMessageConfig, TFileTemplate
};
