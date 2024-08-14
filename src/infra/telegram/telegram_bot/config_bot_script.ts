import { BotCommand, InlineKeyboardButton } from "telegraf/typings/core/types/typegram"
import { TBotTelegram } from "../telegram.type"
import { BotReplyMarkup } from "./type"
import { TelegramBotTemplate } from "../telegram_script/template"
import { ITelegramConfig, TTemplateLanguage } from "../telegram_script/type"
import { TelegramBotInlineKeyBoard } from "../telegram_script/inline_keyboard"

class TelegramConfig extends TelegramBotTemplate implements ITelegramConfig<BotReplyMarkup> {
    constructor(public bot_tele: TBotTelegram, bot_id?: string, default_language: TTemplateLanguage = 'en') {
        super(bot_id, default_language)
    }
    private callback_data = {
        unknown_callback: 'unknown_callback',
    }

    private customInlineKeyboard = (params: any) => {
        const { arr_message, callback_key, current_value, current_index, extra_callback_key } = params
        let keyboardDefault: InlineKeyboardButton = { text: current_value, callback_data: `${callback_key}&${current_value}` }
        switch (callback_key) {
            default:
                break
        }
        return keyboardDefault
    }

    private H = new TelegramBotInlineKeyBoard(this.template_message, this.customInlineKeyboard, this.callback_data)
    private handleMultipleInlineKeyBoard = this.H.handleMultipleInlineKeyBoard
    private handlePaginationInlineKeyBoard = this.H.handlePaginationInlineKeyBoard

    all_commands = (language: TTemplateLanguage = this.default_language) => {
        const commands: BotCommand[] = [

        ]
        return commands
    }

    reply_markup = (language: TTemplateLanguage = this.default_language) => {
        const dataReplyMarkup: BotReplyMarkup = {
            welcome: () => {
                return {
                    inline_keyboard: []
                }
            }
        }
        return dataReplyMarkup
    }
}

export {
    TelegramConfig as TeleConfigBotTemplate
}
