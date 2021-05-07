import { tatsuyaApi } from "@/service/api/api";

export default {
    checkUsername(username: string) {
        return tatsuyaApi.get(`/v1/checkUsername?username=${username}`);
    }
}