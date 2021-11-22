<template>
  <div class="input-box">
    <div class="input-wrapper">
      <input
        type="email"
        class="email-input"
        :class="{ loading: isLoading, valid: isValid }"
        name="email"
        v-bind="$attrs"
        :value="value"
        ref="emailField"
        @input="(event) => $emit('input', event.target.value)"
        @keydown="(event) => onKeyUp(event.target.value)"
        @keydown.delete="onDelete"
        @blur="onBlur"
      />
      <button class="clear" @click.prevent="onClear">&times;</button>
    </div>
    <p v-if="autoCorrect" class="message" @click="onAutoCorrect">
      would you like to correct your email to <b>{{ autoCorrect }}</b
      >?
    </p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import axios from 'axios';

export default {
  name: 'SuperEmailField',

  inheritAttrs: false,

  props: {
    value: {
      type: null,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isValid: false,
      defaultErrorMessage: 'Please enter valid email!',
      isLoading: false,
      autoCorrect: null,
      errorMessage: this.error,
      baseUrl: `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.VUE_APP_API_KEY}`,
    };
  },

  methods: {
    onKeyUp: debounce(async function (value) {
      this.$refs.emailField.setCustomValidity('needs api validation');
      this.errorMessage = null;

      if (!this.$refs.emailField.validity.patternMismatch) {
        this.isLoading = true;

        await axios
          .get(this.baseUrl, {
            params: {
              email: value,
            },
          })
          .then(({ data }) => {
            const { deliverability, autocorrect } = data;

            this.isLoading = false;
            this.isValid = false;

            if (autocorrect) {
              this.autoCorrect = autocorrect;
              this.$refs.emailField.setCustomValidity('needs correction');
              return;
            }

            if (deliverability === 'UNDELIVERABLE') {
              this.errorMessage = 'Please enter valid email!';
              this.$refs.emailField.setCustomValidity(this.errorMessage);
              return;
            }

            this.$refs.emailField.setCustomValidity('');
            this.isValid = true;
          });
      }
    }, 500),

    onBlur() {
      if (this.$refs.emailField.validity.patternMismatch) {
        this.$refs.emailField.setCustomValidity(this.defaultErrorMessage);
        this.errorMessage = this.defaultErrorMessage;
      }
    },

    onAutoCorrect() {
      this.$emit('input', this.autoCorrect);
      this.onKeyUp(this.autoCorrect);
      this.autoCorrect = null;
    },

    onClear() {
      this.$emit('input', '');
      this.autoCorrect = null;
      this.errorMessage = this.defaultErrorMessage;
    },

    onDelete() {
      this.autoCorrect = null;
    },
  },
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
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
  transition: 0.1s;
}

.email-input:placeholder-shown + button {
  opacity: 0;
  pointer-events: none;
}
</style>
