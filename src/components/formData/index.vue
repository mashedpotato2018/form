<template>
  <div class="yjt-form">
    <Form
      ref="formCustom"
      class="warp"
      @on-validate="changevalidate"
      :model="formCustom"
      inline
      :label-width="labelWidth"
      :label-position="labelPosition"
      :label-colon="labelColon"
    >
      <Row type="flex" :justify="justify">
        <Col v-for="(item,index) in formCustom.items" :key="index" v-bind="item.col">
          <Form-item
            v-bind="item.formitem"
            :class="item.props && item.props.noRequired ? 'yjt-form-item ivu-form-item-no-required' : 'yjt-form-item'"
            v-show="item.state()"
            v-if="item.isRender()"
          >
            <div v-if="item.type==='html'" v-html="item.value" />
            <span
              class="yjt-form-span"
              :style="item.textStyle"
              v-if="item.type === 'text'"
            >{{item.value|paseNull}}</span>
            <component
              v-if="item.component"
              :is="item.component"
              v-on="item.events"
              v-bind="item.props"
              :data="item.value"
              v-model="item.value"
              @blur="item.events.blur"
              @focus="item.events.focus"
              @change="item.events.change"
              @on-change="item.events.onChange"
            />
            <Cascader
              ref="cascader"
              v-if="item.type === 'cascader'"
              :data="item.data"
              v-model="item.value"
              v-bind="item.props"
              @on-change="item.events.onChange"
            ></Cascader>
            <InputNumber
              v-if="item.type === 'inputnumber'"
              v-model="item.value"
              v-bind="item.props"
              @on-blur="item.events.blur"
              @on-change="item.events.onChange"
            />
            <Input
              v-if="item.type === 'input'"
              v-model.trim="item.value"
              v-bind="item.props"
              @on-blur="item.events.blur"
              @on-keyup="item.events.onKeyup"
              @on-keydown="item.events.onKeydown"
            />
            <!-- <i-select
              @on-change="item.events.onChange"
              label-in-value
              v-if="item.type === 'select'"
              v-model="item.value"
              :multiple="true"
              v-bind="item.props"
            >
              <i-option v-for="(i, index) in item.data" :key="index" :value="i.value">{{i.text}}</i-option>
            </i-select>-->
            <tdnselect
              v-on="item.events"
              v-if="item.type === 'select'"
              :data="item.data"
              :value="item.value"
              :props="item.props"
              :formModel="model"
            ></tdnselect>
            <RadioGroup
              v-if="item.type === 'radio'"
              v-model="item.value"
              @on-change="item.events.onChange"
            >
              <Radio v-for="(i, index) in item.data" :key="index" :label="i.value">{{i.text}}</Radio>
            </RadioGroup>
            <CheckboxGroup
              v-if="item.type === 'checkbox'"
              v-model="item.value"
              @on-change="item.events.onChange"
            >
              <Checkbox
                v-for="(i, index) in item.data"
                :key="index"
                :label="i.value"
                v-bind="i.props"
              >{{i.text}}</Checkbox>
            </CheckboxGroup>
            <DatePicker
              v-model="item.value"
              v-if="item.type === 'datepicker'"
              @on-change="item.events.onChange"
              v-bind="item.props"
            />
            <div v-if="compare.data[item.key]||compare.data[item.key]===0" class="compare">
              <span class="data-cover">{{compare.text}}:</span>
              <span
                class="data-cover-text"
                v-if="compare.show&&compare.show[item.key]"
              >{{compare.show[item.key][compare.data[item.key]]}}</span>
              <span class="data-cover-text" v-else>{{compare.data[item.key]}}</span>
              <span class="data-cover-btn" @click="compareCover(item.key,index)">填入</span>
            </div>
          </Form-item>
        </Col>
        <Col v-if="search" class="search">
          <Button class="search-Btn-one" type="info" @click="doFunSubmit">查询</Button>
          <Button @click="doFunReset" style="margin-left: 8px">清空查询条件</Button>
        </Col>
      </Row>
      <Row>
        <Col v-if="operation">
          <ul class="btnlist">
            <li
              v-for="(item,index) in operation"
              :key="index"
              :class="item.class"
              @click="item.event"
              :style="item.style"
            >{{item.text}}</li>
          </ul>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { request } from "@/libs/formrequest.js";
import {
  handleUrl,
  generateOptions,
  generateTreeOptions,
  assign
} from "@/libs/util.js";
import tdnselect from "./tdn-select";
// import { mapMutations } from "vuex";(暂不使用)
export default {
  components: {
    tdnselect
  },
  name: "FormData",
  filters: {
    paseNull(val) {
      if (val || val === 0) return val;
      return "--";
    }
  },
  data() {
    return {
      model: {},
      name: "index",
      changeTypeList: ["select", "radio", "checkbox", "cascader"],
      formCustom: {
        items: []
      },
      datatype: this.type
    };
  },
  props: {
    compare: {
      type: Object,
      default: () => {
        return {
          data: {}
        };
      }
    },
    editState: {
      type: Boolean,
      default: true
    },
    operation: {
      type: Array,
      default: () => []
    },
    afterReset: {
      type: Function,
      default: () => {}
    },
    labelWidth: {
      type: Number,
      default: 188
    },
    labelPosition: {
      type: String,
      default: "right"
    },
    labelColon: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    submit: {
      type: [String, Object]
    },
    type: {
      type: String
    },
    justify: {
      type: String,
      default: "start"
    },
    configs: {
      type: Array,
      required: true
    },
    usingRemote: {
      type: Boolean,
      default: true
    },
    getdata: {
      type: [String, Object]
    }
  },
  watch: {
    formModel() {
      Object.assign(this.model, this.formModel);
    },
    type(newval) {
      this.datatype = newval;
      this.initForm();
    },
    data(newval) {
      // this.initState(true);(全局离开提示状态)
      if (newval && Object.keys(newval).length > 0) {
        this.handleCopy(newval);
      }
    },
    configs() {
      this.initConfigs();
      this.initForm();
    }
  },
  created() {
    !this.type &&
      this.$route &&
      this.$route.query &&
      this.$route.query.type &&
      (this.datatype = this.$route.query.type);
    // this.initState(true);(全局离开提示状态)
    this.initConfigs();
    this.initForm();
  },
  computed: {
    /**
     * 表单数据对象
     */
    formModel() {
      let obj = {};
      this.formCustom.items.forEach(item => {
        if (!item.key) return;
        let keys = item.key.split(".");
        let sysobj = this.handleRecursionObj(item.key.split("."), item.value);
        obj = assign(obj,sysobj)
      });
      return obj;
    }
  },
  methods: {
    changevalidate(prop, status, error) {
      // console.log(prop, status, error)
    },
    compareCover(key, index) {
      this.formCustom.items[index].value = this.compare.data[key];
      this.compare.data[key] = "";
    },
    doFunSubmit() {
      this.$refs["formCustom"].validate(valid => {
        if (valid) {
          let model = {};
          if (this.submit.request) {
            if (!this.submit.request(this.model)) {
              return;
            }
            model = this.submit.request(this.model);
          } else {
            model = this.model;
          }
          if (typeof this.submit === "object") {
            this.submit.method = this.submit.method || "post";
          }
          // this.initState(false);(全局离开提示状态)
          let questObj = handleUrl(this.submit);

          Object.assign(questObj.where, model);

          request(questObj).then(res => {
            this.submit.response && this.submit.response(res);
          });
        }
      });
    },
    /**
     * 清空表单并提交(用于表格查询)
     */
    doFunReset() {
      const callback = this.afterReset;
      this.doFunResetFields(callback);
      this.doFunSubmit();
    },
    /**
     * 只清空表单
     */
    doFunResetFields(callback) {
      this.$refs["formCustom"].resetFields();
      callback && callback();
    },
    /**
     * 获取数据处理
     */
    handledata() {
      if (this.data && Object.keys(this.data).length > 0) {
        this.handleCopy(this.data);
        return;
      }
      if (!this.usingRemote) return;
      if (!this.getdata) return;
      let questObj = handleUrl(this.getdata);
      request(questObj).then(res => {
        if (res.data.code !== 200) {
           this.$Message.error(res.data.msg);
          return;
        }
        let data = res.data.datas;
        if (typeof this.getdata === "object" && this.getdata.response) {
          data = this.getdata.response(data);
        }
        this.handleCopy(data);
      });
    },
    /**
     * 表单赋值
     */
    handleCopy(data) {
      this.formCustom.items.forEach(item => {
        if (!item.key) return;
        item.value = this.handleRecursion(data, item.key.split("."));
      });
    },
    // 递归返回赋值
    handleRecursion(data, keys) {
      if (keys.length === 1) {
        return data[keys[0]];
      }
      let obj = data[keys[0]];
      keys.shift();
      return this.handleRecursion(obj, keys);
    },
    handleRecursionObj(keys, val) {
      let syskeys = JSON.parse(JSON.stringify(keys));
      let obj = {};
      if (keys.length === 1) {
        obj[keys[0]] = val;
        return obj;
      }
      keys.shift();
      obj[syskeys[0]] = this.handleRecursionObj(keys, val);
      return obj;
    },
    /**
     * 处理下拉数据
     */
    handleSelect() {
      const initdata = this.formCustom.items.filter(item =>
        this.changeTypeList.includes(item.type)
      );
      initdata.forEach(item => {
        let show = {
          text: "text",
          value: "value"
        };
        let data = [];
        let pId = 0;
        let tree = false;
        if (!item.ArrayPro) return;
        item.ArrayPro.show && (show = item.ArrayPro.show);
        item.ArrayPro.pId && (pId = item.ArrayPro.pId);
        tree = !!item.ArrayPro.tree;
        if (!item.ArrayPro.data && item.ArrayPro.getdata) {
          let questObj = handleUrl(item.ArrayPro.getdata);
          request(questObj).then(res => {
            if (item.ArrayPro.getdata.response) {
              data = item.ArrayPro.getdata.response(res.data.datas);
            } else {
              data = res.data.datas;
            }
            if (item.type === "cascader") {
              if (tree) data = generateTreeOptions(data, show, pId);
              else data = generateOptions(data, show, pId);
            } else {
              data = data.map(i => {
                let obj = {
                  text: i[show.text],
                  value: i[show.value],
                  props: i.props
                };
                Object.assign(obj, i);
                return obj;
              });
            }
            item.data = data;
          });
        } else {
          item.ArrayPro.data &&
            (item.data = item.ArrayPro.data.map(i => {
              let obj = {
                text: i[show.text],
                value: i[show.value],
                props: i.props
              };
              Object.assign(obj, i);
              return obj;
            }));
        }
      });
    },
    /**
     * 初始化表单
     */
    initForm() {
      const init = {
        look: this.initLook,
        add: this.initadd,
        edit: this.initedit
      };
      this.formCustom.items.forEach((item, index) => {
        item.rules && this.initRules(item);
        item.formitem = {
          label: item.title,
          rules: item.rules,
          prop: `items.${index}.value`,
          style: item.style
        };
      });
      this.datatype && init[this.datatype]();
    },
    /**
     * 初始化配置项
     */
    initConfigs() {
      this.formCustom.items = [];
      const that = this;
      this.configs.forEach((item, index) => {
        if (!item.state) item.state = () => true;
        if (!item.isRender) item.isRender = () => true;
        let obj = {};

        Object.assign(obj, item);
        if (!(obj.value || obj.value === 0)) {
          obj.value = "";
        }
        obj.data = (obj.ArrayPro && obj.ArrayPro.data) || [];

        const validate = function() {
          that.$refs.formCustom.validateField(`items.${index}.value`);
        };

        const setval = function(data) {
          that.formCustom.items.forEach(item => {
            if (item.key === obj.key) {
              item.value = data;
            }
          });
          that.$refs.formCustom &&
            that.$refs.formCustom.validateField(`items.${index}.value`);
        };
        if (!obj.events) {
          obj.events = {};
          if (obj.component || obj.type === "select") {
            obj.events.onChange = setval;
          } else {
            obj.events.onChange = () => {};
          }
        } else {
          if (obj.events.onChange == undefined) {
            if (obj.component || obj.type === "select") {
              obj.events.onChange = setval;
            }
          }
        }
        !obj.events.onChange && (obj.events.onChange = () => {});
        !obj.events.change && (obj.events.change = validate);
        !obj.events.blur && (obj.events.blur = validate);
        !obj.events.focus && (obj.events.focus = function() {});
        !obj.events.onKeyup && (obj.events.onKeyup = function() {});
        !obj.events.onKeydown && (obj.events.onKeydown = function() {});

        this.formCustom.items.push(obj);
      });
    },
    initLook() {
      this.formCustom.items.forEach(item => {
        if (!item.component) item.type = item.type || "text";
      });
      this.handleSelect();
      this.handledata();
    },
    initadd() {
      this.formCustom.items.forEach(item => {
        if (!item.component) item.type = item.type || "input";
      });
      this.handleSelect();
      if (this.data && Object.keys(this.data).length > 0) {
        this.handleCopy(this.data);
      }
    },
    initedit() {
      this.formCustom.items.forEach(item => {
        if (!item.component) item.type = item.type || "input";
      });
      this.handleSelect();
      this.handledata();
    },
    /**
     * 初始化状态
     */
    // initState(state) {
    //   if (this.datatype != "look" && !this.search && this.editState) {
    //     this.$nextTick(() => {
    //       this.$store && this.setEditState(state);
    //     });
    //   }
    // },
    /**
     * 初始化验证
     */
    initRules(params) {
      let trigger = "blur";
      this.changeTypeList.includes(params.type) && (trigger = "change");
      const obj = {
        required: true,
        message: `请输入${params.title}`,
        trigger
      };
      params.rules.forEach(item => {
        if (item.required) {
          Object.assign(obj, item);
          Object.assign(item, obj);
          item.validator && delete item.message;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.yjt-form {
  padding: 26px 24px;
  font-size: 14px;
  .yjt-form-item {
    min-width: 484px;
    padding: 0 20px;
    .compare {
      position: absolute;
      top: 100%;
      left: 0;
      line-height: 1;
      padding-top: 6px;
      .data-cover-text {
        margin-right: 8px;
      }
      .data-cover {
        color: #333333;
        font-weight: bold;
        margin-right: 8px;
      }
      .data-cover-btn {
        color: #2aaef2;
        cursor: pointer;
      }
    }
  }
  .ivu-form-item-content {
    margin-top: 4px;
  }
  .ivu-form-item-label {
    line-height: normal;
    font-size: 14px;
    padding-right: 20px;
  }
  .ivu-form-item-no-required .ivu-form-item-label:before {
    content: "";
  }
  .yjt-form-span {
    font-size: 14px;
  }
  .search {
    padding-top: 6px;
    padding-right: 20px;
    width: 484px;
    text-align: right;
  }
  .btnlist {
    padding: 20px 20px 0 130px;
    display: flex;
    .delete {
      color: #df242f;
      border-color: #df242f;
      &:hover {
        background-color: #df242f;
      }
    }
    .disable {
      color: #ccc;
      border-color: #ccc;
      &:hover {
        color: #ccc;
      }
    }
    .submit {
      color: #10b1f9;
      border-color: #10b1f9;
      &:hover {
        background-color: #10b1f9;
      }
    }
    .cancel {
      color: #333;
      border-color: #999999;
      &:hover {
        background-color: #999999;
      }
    }
    li {
      padding: 5px 22px;
      text-align: center;
      border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
      & + li {
        margin-left: 16px;
      }
    }
  }
}
.ivu-form-inline .ivu-form-item,
.ivu-input-number,
.ivu-date-picker {
  display: block !important;
  margin-right: 0px !important;
  width: 100% !important;
}
.ivu-input-number-handler-down-inner,
.ivu-input-number-handler-up-inner,
.ivu-select-arrow,
.ivu-input-suffix > i,
.ivu-cascader-arrow {
  color: #10b1f9;
}
.ivu-checkbox-wrapper,
.ivu-radio-wrapper {
  margin-right: 45px;
}
</style>