<template>
  <div class="input-box">
    <div class="input-wrapper">
      <input
        type="email"
        class="email-input"
        :class="{loading: isLoading}"
        name="email"
        v-bind="$attrs"
        :value="value"
        ref="emailField"
        @input="(event) => $emit('input', event.target.value)"
        @keyup="(event) => onKeyUp(event.target.value)"
        @keyup.delete="onDelete"
      />
      <button class="clear" @click.prevent="onClear">&times;</button>
    </div>
    <p v-if="autoCorrect" class="message" @click="onAutoCorrect">
      would you like to correct your email to <b>{{ autoCorrect }}</b>?
    </p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>

import debounce from "lodash/debounce";

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

  data() {
    return {
      isLoading: false,
      autoCorrect: null,
      errorMessage: this.error,
      apiURL: `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.VUE_APP_API_KEY}`
    }
  },

  methods: {
    onKeyUp: debounce(async function(value) {
      const url = new URL(this.apiURL);
      const params = {
        email: value
      };

      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      if (this.$refs.emailField.validity.valid) {
        this.$refs.emailField.setCustomValidity('');
        this.isLoading = true;

        await fetch(url)
          .then(response => response.json())
          .then(response => {
            const { deliverability, autocorrect } = response;

            this.isLoading = false;

            if(autocorrect) {
              this.autoCorrect = autocorrect;
              return;
            }

            if(deliverability === 'UNDELIVERABLE') {
              this.errorMessage = 'Please enter valid email!';
              this.$refs.emailField.setCustomValidity(this.errorMessage);
            }
          });
      }
    }, 500),

    onAutoCorrect() {
      this.$emit('input', this.autoCorrect);
      this.onKeyUp(this.autoCorrect);
      this.autoCorrect = null;
    },

    onClear() {
      this.$emit('input', '');
    },

    onDelete() {
      this.autoCorrect = null;
    }
  }
};
</script>

<style scoped>
.input-box {
  display: flex;
  flex-flow: column wrap;
  position: relative;
}

.input-wrapper {
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

.message {
  cursor: pointer;
}

.error {
  color: red;
}

.loader {
  position: absolute;
  height: 20px;
  right: 8px;
  width: 20px;
  margin-top: -12px;
  top: 50%;
  display: none;
  animation: around 5.4s infinite;
}

@keyframes around {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}

.loading {
  pointer-events: none;
  opacity: 0.5;
}

.clear {
  position: absolute;
  border: none;
  display: block;
  width: 15px;
  height: 15px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 50%;
  top: 50%;
  margin-top: -9px;
  bottom: 0;
  right: 5px;
  background: #ddd;
  padding: 0;
  outline: none;
  cursor: pointer;
  transition: .1s;
}

.email-input:placeholder-shown + button {
  opacity: 0;
  pointer-events: none;
} 
</style>
