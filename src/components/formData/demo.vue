<template>
  <div>
    <form-data ref="pro" :type="type" :compare="compare" :data="data" :submit="submit" :configs="configs" :getdata="getdata" />
  </div>
</template>

<script>
import FormData from "./index.vue";
export default {
  data() {
    return {
      name: "demo",
      type: "edit",
      // getdata: ProjectDtl,//字符串默认url  默认{url:url,where:{},method: 'get'}
      getdata: {
        // 获取数据对象
        url: 'api/*/*', // 获取数据地址
        where: {
          asd: 123
        }, // 携带参数
        method: "get", // 请求方式（默认get）
        response: data => data // 处理响应数据并返回处理后数据
      },
      compare: {
        text: '读取信息',
        data: {
          radio: '李四',
          contractorCorpName: '测试'
        }
      },
      data: {
        radio: '张三',
        checkbox: ['吃饭'],
        name: '呃呃呃',
        areaName: '山西省|长治市|屯留县',
        category: '3a9bf5f8-c0ee-475e-8c5e-5cb7af60e3ab',
        contractorCorpName: '测试项目加'
      }, // 数据源表单数据，静态数据>远程数据
      // submit: '',//字符串默认url  默认{url:url,where:{},method: 'post'}
      submit: {
        // 提交表单对象
        url: 'api/*/*', // 发送数据地址
        method: "get",
        where: {
          asd: 678
        }, // 发送数据加携带参数
        request: model => model, //发送数据前处理方法（model为表单数据） --要有返回值 true继续提交，false终止
        response: data => {
          console.log("提交后", data);
        } // 发送数据后处理方法(data为提交表单后返回数据)
      },
      justify: "start", //默认为start， 整体布局方式(start子元素向左排列/end子元素向右排列/center子元素居中排列/space-between子元素等宽排列/space-around子元素分散排列)
      configs: [
        // 表单配置集合
        // {
        //   title: "组件",
        //   key: 'ssss',
        //   component: YJTUpload,
        //   type: 'custom',
        //   props: {
        //     isLook: true,
        //     fileSize: 100
        //   },
        //   col:{
        //     span: 24
        //   },
        //   rules: [
        //     {
        //       validator: (rule, value, callback)=>{
        //         if (!value) {
        //             callback(new Error('请上传附件'));
        //         } else {
        //             callback();
        //         }
        //       },
        //       trigger: 'change'
        //     }
        //   ],
        // },
        {
          title: "单选框", // 显示名称
          key: "radio", // 字段名
          type: "radio",
          value: "张三",
          ArrayPro: {
            data: [
              {
                text: "张三",
                value: "张三"
              },
              {
                text: "李四",
                value: "李四"
              }
            ]
          }
        },
        {
          title: "复选框", // 显示名称
          key: "checkbox", // 字段名
          type: "checkbox",
          value: ["吃饭"],
          ArrayPro: {
            data: [
              {
                text: "吃饭",
                value: "吃饭"
              },
              {
                text: "睡觉",
                value: "睡觉"
              }
            ]
          }
        },
        {
          title: "项目名称", // 显示名称
          key: "name", // 字段名
          rules: [{ required: true }]
        },
        {
          title: "项目所在地", // 显示名称
          key: "areaName", // 字段名
          rules: [{ required: true }]
        },
        {
          title: "项目分类", // 显示名称
          key: "category", // 字段名
          rules: [{ required: true }],
          props: {
            filterable: true,
            clearable: true
          },
          type: "select",
          ArrayPro: {
            // data: [], //静态>远程
            getdata: {
              url: 'api/*/*',
              where: {
                TypeInfo: "xmfl"
              }// 发送数据加携带参数
            },
            show: {
              // 默认text：'text', value: 'value'
              text: "name",
              value: "guid"
            }
          },
          events: {
            OnchangeAfter(data){
              console.log(data)
            }
          }
        },
        {
          title: "建设单位", // 显示名称
          key: "contractorCorpName" // 字段名
        }
      ]
    };
  },
  components: {
    FormData
  }
};
</script>

<style>
</style>