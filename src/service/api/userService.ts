import { AxiosResponse } from "axios";
import { gatewayApi } from "./api";

export default {
    GetAvatar(username?: string): Promise<AxiosResponse> {
        return gatewayApi.get(`/v1/user/avatar/${username}`)
    }
}