import { tele_bot } from '..';
import { ErrorHandler } from '../../../../lib/error_handler';
import { mongo } from '../../../database/mongo/mongo';
import { ConvertTeleError } from '../../telegram.error';
import { TDataContext } from '../../telegram.type';
import { TTemplateLanguage } from '../../telegram_template/type';

export const verify_welcome_handler = async (dataContext: TDataContext, language?: TTemplateLanguage) => {
    const session = mongo.startSession()
    const { userId, chatId, userFullName } = dataContext
    try {

    } catch (e) {
        if (session?.inTransaction()) await session.abortTransaction()
        ErrorHandler(e, { userId, userFullName, chatId }, verify_welcome_handler.name)
        ConvertTeleError(e, tele_bot, chatId, language)
    } finally {
        await session.endSession()
    }
}