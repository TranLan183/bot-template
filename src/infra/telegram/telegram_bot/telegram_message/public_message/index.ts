import { ErrorHandler } from "../../../../../lib/error_handler"
import { TDataContext } from "../../../telegrot/type"
import { TUserSetting } from "../../telegram_cache/cache.data_user"

export const handlePublicChat = async (dataMessageContext: TDataContext, dataUserSetting: TUserSetting) => {
    const { message, userId, username } = dataMessageContext
    try {
        // console.log(dataMessageContext);
        return
    } catch (error) {
        ErrorHandler(error, { message, userId, username }, handlePublicChat.name).throwErr()
    }
}