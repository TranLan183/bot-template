import { ForceReply, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "telegraf/typings/core/types/typegram";
import { file_template } from ".";

type TTemplateLanguage = keyof typeof file_template
type TTemplate = keyof typeof file_template.en


type TReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined
type TTemplateMessageConfig = { template: TTemplate, bot_id?: string, args?: object, language?: TTemplateLanguage }

type ReplyMarkup = {
    welcome: TReplyMarkup
}

export {
    TTemplate,
    TTemplateLanguage,
    TReplyMarkup,
    TTemplateMessageConfig,
    ReplyMarkup
}