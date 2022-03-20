import { gatewayApi } from "./api";

export default {
    // Returns Base64 encoded string of avatar
    GetAvatar(username?: string): Promise<string> {
        const url = username ? `/v1/user/avatar/${username}` : `/v1/user/avatar`;
        return gatewayApi.get(url, { responseType: "arraybuffer" })
            .then(response => {
                const contentType = response.headers["content-type"];
                const b64 = Buffer.from(response.data, "binary").toString("base64")

                const encodedString = `data:${contentType};base64,${b64}`;
                return Promise.resolve(encodedString);
            })
    }
}