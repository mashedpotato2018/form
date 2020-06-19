import axios from "@/libs/api.request";
export const request = function(questObj){
    let param = {
        url: questObj.url,
        method: questObj.method,
    }
    if(questObj.method === 'get'){
        param.params = questObj.where
    }else{
        param.data = questObj.where
    }
    return axios.request(param);
}