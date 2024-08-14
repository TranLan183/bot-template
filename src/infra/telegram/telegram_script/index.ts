import { BotCommand, BotCommandScope } from 'telegraf/typings/core/types/typegram';
import { ITelegramConfig, TOptionSendAnswerCbQuery, TOptionSendBufferPhoto, TOptionSendMessage, TOptionSendUrlPhoto } from './type';
import { MILLISECOND_PER_ONE_SEC } from '../../../lib/constants';

class TelegramBotScript<T> {
    constructor(private configBot: ITelegramConfig<T>) {

    }
    private _bot_tele = this.configBot.bot_tele
    public templateMessage = this.configBot.template_message
    public entities_message = this.configBot.message_entities
    public replyMarkup = this.configBot.reply_markup
    public all_commands = this.configBot.all_commands

    sendMessage = (chat_id: string | number, options: TOptionSendMessage) => {
        let { life_time } = options
        const { template, language, parse_mode, reply_markup, args, message_id } = options
        return this._bot_tele.telegram.sendMessage(chat_id, this.templateMessage(options), {
            link_preview_options: {
                is_disabled: true
            },
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.configBot.reply_markup(language)[template](args) : reply_markup === 'force_reply' ? this.configBot.reply_markup(language)['force_reply']() : reply_markup : undefined,
            reply_parameters: message_id ? { message_id } : undefined,
        }).then((value) => {
            life_time = life_time === "long" ? 30 : life_time
            life_time = life_time === "medium" ? 15 : life_time
            life_time = life_time === "short" ? 5 : life_time
            if (life_time) {
                setTimeout(() => this._bot_tele.telegram.deleteMessage(chat_id, value.message_id).catch(err => console.log(err)), life_time * MILLISECOND_PER_ONE_SEC)
            }
            return value
        })
    }

    sendAnswerCbQuery = (callbackQueryId: string, options: TOptionSendAnswerCbQuery) => {
        return this._bot_tele.telegram.answerCbQuery(callbackQueryId, this.templateMessage(options), options)
    }

    sendBufferPhoto = (chat_id: string | number, options: TOptionSendBufferPhoto) => {
        const {
            life_time,
            caption,
            source,
            reply_markup,
            callback } = options
        return this._bot_tele.telegram.sendPhoto(chat_id,
            {
                source,
            },
            {
                caption: caption + (life_time ? `\n\n_Note: This message will disappear after ${life_time} seconds_` : ""),
                parse_mode: "Markdown",
                reply_markup,

            }
        ).then((img_msg_data) => {
            if (life_time) {
                setTimeout(() => this._bot_tele.telegram.deleteMessage(chat_id, img_msg_data.message_id), life_time * MILLISECOND_PER_ONE_SEC)
            }
            callback(img_msg_data)
        })
    }

    sendUrlPhoto = (chat_id: string | number, options: TOptionSendUrlPhoto) => {
        const {
            life_time,
            caption,
            url,
            reply_markup,
            callback } = options
        return this._bot_tele.telegram.sendPhoto(chat_id,
            {
                url,
            },
            {
                caption: caption + (life_time ? `\n\n_Note: This message will disappear after ${life_time} seconds_` : ""),
                parse_mode: "Markdown",
                reply_markup
            }
        ).then((img_msg_data) => {
            if (life_time) {
                setTimeout(() => this._bot_tele.telegram.deleteMessage(chat_id, img_msg_data.message_id), life_time * MILLISECOND_PER_ONE_SEC)
            }
            callback(img_msg_data)
        })
    }

    editMessage = (chat_id: string | number, message_id: number, options: TOptionSendMessage) => {
        const { template, language, parse_mode, reply_markup, args } = options
        return this._bot_tele.telegram.editMessageText(chat_id, message_id, undefined, this.templateMessage(options), {
            link_preview_options: {
                is_disabled: true
            },
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.replyMarkup(language)[template](args) : reply_markup === 'force_reply' ? this.configBot.reply_markup(language)['force_reply']() : reply_markup : undefined
        })
    }

    deleteMessage = (chat_id: string | number, message_id: number) => {
        return this._bot_tele.telegram.deleteMessage(chat_id, message_id)
    }

    setCommands = (data_command: BotCommand[], scope?: BotCommandScope) => {
        const commandScope = scope ? { scope } : undefined
        this._bot_tele.telegram.setMyCommands(data_command, commandScope)
    }
}

export {
    TelegramBotScript
};

