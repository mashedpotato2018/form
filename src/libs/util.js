import Cookies from 'js-cookie'
// import storage from "@/libs/storage.js"

/**
 * 获取token
 * @param {*} key 
 */
export const getToken = (key) => {
  const token = Cookies.get(key)
  if (token) return token
  else return false
}

/**
 * 处理请求地址
 * @param {*} getdata 
 */
export const handleUrl = (getdata) => {
  let questObj = {}
  // 每次默认携带参数
  const params = {
    // pro_id: storage.get("proId") || "",
    // com_id: storage.get("cid") || "",
    // peo_id: storage.get("pid") || "",
    // upt: storage.get("pid") || "",
  }
  if (typeof getdata === "string") {
    questObj = {
      url: getdata,
      method: "get",
      where: params
    }
  } else {
    if (getdata.where) {
      Object.assign(params, getdata.where)
      Object.assign(getdata.where, params)
    } else {
      getdata.where = params
    }
    questObj = {
      url: getdata.url || '',
      method: getdata.method || "get",
      where: getdata.where
    }
  }
  return questObj
}

/**
 * 根据后台的综合数组返回一个级联层级数据
 */
export const generateOptions = (params, show, pId = 0) => {
  //生成Cascader级联数据
  var result = [];
  for (let param of params) {
    if (param.pId == pId) {
      //判断是否为顶层节点
      // debugger;
      var parent = {
        //转换成el-Cascader可以识别的数据结构
        label: param[show.text],
        value: param[show.value]
      };
      parent.children = getchilds(param.id, params); //获取子节点
      result.push(parent);
    }
  }
  return result;
};

/**
 * 根据后台的树形数组返回一个级联层级数据
 */
export const generateTreeOptions = (params, show) => {
  //生成Cascader级联数据
  var result = [];
  params.forEach(param => {
    var parent = {
      //转换成el-Cascader可以识别的数据结构
      label: param[show.text],
      value: param[show.value]
    };
    parent.children = generateTreeOptions(param.childs, show)
    result.push(parent)
  })
  return result;
};

/**
 * 合并不确定层级同名属性对象
 * @param {*} target 目标对象
 * @param {*} obj 合并对象
 */
export const assign = (target, obj) => {
  let temp = {}
  Object.assign(temp,target)
  for (const key in obj) {
    if(target[key]){
      if(typeof obj[key] ==='object'){
        temp[key] = assign(temp[key],obj[key])
      }else{
        temp[key] = obj[key]
      }
    }else{
      temp[key] = obj[key]
    }
  }
  return temp
}

export const getchilds = (id, array) => {
  let childs = new Array();
  for (let arr of array) {
    //循环获取子节点
    if (arr.pId == id) {
      childs.push({
        label: arr.name,
        value: arr.id,
        parentId: id
      });
    }
  }
  for (let child of childs) {
    //获取子节点的子节点
    let childscopy = getchilds(child.value, array); //递归获取子节点
    if (childscopy.length > 0) {
      child.children = childscopy;
    }
  }
  return childs;
};