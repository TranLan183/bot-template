import { BotCommand, InlineKeyboardButton } from "telegraf/typings/core/types/typegram"
import { TelegramBotInlineKeyBoard } from "../telegrot/inline_keyboard"
import { EFlag, TelegramBotTemplate } from "../telegrot/template"
import { ITelegramConfig, TCustomInlineKeyboardParams, TFileTemplate, TTemplateLanguage } from "../telegrot/type"
import { BotReplyMarkup, BotTemplate } from "./type"

class TelegramConfig extends TelegramBotTemplate<BotReplyMarkup, BotTemplate> implements ITelegramConfig<BotReplyMarkup, BotTemplate> {

    private callback_data = {
        unknown_callback: 'unknown_callback',
        test: 'test',
        btn_switch_language: 'btn_switch_language',
        btn_inline_keyboard: 'btn_inline_keyboard'
    }

    private customInlineKeyboard = (params: TCustomInlineKeyboardParams) => {
        const { arr_message, callback_key, current_value, current_index, extra_callback_key } = params
        let keyboardDefault: InlineKeyboardButton = { text: current_value, callback_data: `${callback_key}&${current_value}` }
        switch (callback_key) {
            case this.callback_data.btn_switch_language: {
                const flag = current_value.split(' ')[0]
                keyboardDefault.callback_data = `${callback_key}&${EFlag[flag]}&${flag}`
                break
            }
            default:
                break
        }
        return keyboardDefault
    }

    constructor(file_template: TFileTemplate, default_language: TTemplateLanguage = 'en') {
        super(file_template, default_language)
    }

    private CustomTelegramKeyboard = new TelegramBotInlineKeyBoard(this.template_message, this.customInlineKeyboard, this.callback_data)
    private handleMultipleInlineKeyBoard = this.CustomTelegramKeyboard.handleMultipleInlineKeyBoard
    private handlePaginationInlineKeyBoard = this.CustomTelegramKeyboard.handlePaginationInlineKeyBoard


    all_commands: (language?: TTemplateLanguage) => BotCommand[] = (language = this.default_language) => {
        const commands: BotCommand[] = [

        ]
        return commands
    }

    reply_markup = (language?: TTemplateLanguage): BotReplyMarkup => {
        const dataReplyMarkup: BotReplyMarkup = {
            ...super.reply_markup(),
            welcome: () => {
                return {
                    keyboard: [
                        [
                            { text: this.template_message({ template: 'btn_kb_keyboard', language }) },
                            { text: this.template_message({ template: 'btn_kb_inline_keyboard', language }) }
                        ]
                    ]
                }
            },
            reply_btn_kb_inline_keyboard: () => {
                return {
                    inline_keyboard: [
                        [
                            { text: this.template_message({ template: 'btn_inline_keyboard', language }), callback_data: this.callback_data.btn_inline_keyboard }
                        ]
                    ]
                }
            }
        }
        return dataReplyMarkup
    }
}

export {
    TelegramConfig as TeleConfigBotTemplate
}
