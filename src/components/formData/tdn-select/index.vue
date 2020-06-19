<template>
  <i-select @on-change="onChange" v-model="selectvalue" v-bind="props">
    <i-option v-for="(i, index) in data" :key="index" :value="i.value">{{i.text}}</i-option>
  </i-select>
</template>

<script>
export default {
  props: {
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    value: {
      default: ""
    },
    data: {
      type: Array,
      default: () => []
    },
    formModel: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      selectvalue: ""
    };
  },
  created() {
    this.selectvalue = this.value;
  },
  watch: {
    value(){
      this.selectvalue = this.value;
    },
    data(){
      let obj = this.data.filter(item => item.value === this.value)[0];
      if (obj) {
        this.selectvalue = obj.value;
      }
      if(this.value){
        this.$emit("onChange", this.selectvalue);
      }
    },
    selectvalue(newval) {
      this.$emit("onChange", newval);
    }
  },
  methods: {
    onChange(val) {
      let obj = this.data.filter(item=>item.value === val)[0];
      let model = this.$parent
      this.$emit('onChangeAfter',{
          data: obj,
          formModel: this.formModel
      })
    }
  }
};
</script>