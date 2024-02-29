import uuidAPIKey from "uuid-apikey"

const createNewAPIKey = () => {
    return uuidAPIKey.create().apiKey
}

const isAPIKey = (apiKey: string) => uuidAPIKey.isAPIKey(apiKey)

export { 
    createNewAPIKey,
    isAPIKey
}