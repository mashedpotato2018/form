/** 
 * by Bunny
 * 用于处理本地存储
 */

 var storage = {
     //设置值
     set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
     },
     //获取值
     get(key) {
        return JSON.parse(localStorage.getItem(key))
     },
     //删除某个值
     remove(key) {
        localStorage.removeItem(key)
     },
     //清空缓存
     clear(){
        localStorage.clear()
     }
 }

 export default storage;
