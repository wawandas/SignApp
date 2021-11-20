<template>
  <div class="input-box">
    <input
      type="email"
      class="email-input"
      name="email"
      v-bind="$attrs"
      :value="value"
      ref="emailField"
      @input="(event) => $emit('input', event.target.value)"
      @keyup="onKeyUp"
    />
    <label v-if="error" class="error">{{ error }}</label>
  </div>
</template>

<script>

import debounce from "lodash/debounce";

console.log(debounce);

export default {
  name: "SuperEmailField",

  inheritAttrs: false,

  props: {
    value: {
      type: null,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },

  computed: {},

  methods: {
    onKeyUp: debounce(function() {
      console.log(process.env.VUE_APP_API_KEY);
      if(this.$refs.emailField.validity.valid) {
        //make request
        console.log(process.env.VUE_APP_API_KEY);
      }
    }, 300)
  }
};
</script>

<style scoped>
.input-box {
  display: flex;
  flex-flow: column wrap;
  position: relative;
}

input {
  padding: 18px 0;
  background-color: #fff;
  border: none;
  border-radius: 2px;
  width: 100%;
  font-size: 16px;
  color: #b7bcdd;
  outline: none;
  text-indent: 18px;
  z-index: 0;
  line-height: 1;
}
</style>
