import { gatewayApi } from "./api";

export default {
    GetAvatar(username?: string): Promise<string> {
        return gatewayApi.get(`/v1/user/avatar/${username}`)
            .then(response => Buffer.from(response.data, "binary").toString("base64"))
    }
}