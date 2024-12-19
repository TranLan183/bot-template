import { ErrorHandler } from "../../../../../lib/error_handler"
import { TCacheDataUser, TDataContext } from "../../../telegrot/type"

export const handlePublicChat = async (dataMessageContext: TDataContext, user_storage: TCacheDataUser) => {
    const { message, userId, username } = dataMessageContext
    try {
        // console.log(dataMessageContext);
        return
    } catch (error) {
        ErrorHandler(error, { message, userId, username }, handlePublicChat.name).throwErr()
    }
}