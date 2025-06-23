import { CaptureException } from "./infra/logging/sentry"

(async () => {
    try {
    } catch (e) {
        CaptureException(e, {})
    }
})()