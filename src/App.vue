<template>
  <form class="example-form">
    <h3>To sign up please enter you email below</h3>
    <SuperEmailField
      v-model="user.email"
      placeholder="Enter your email here"
      pattern=".+@.+\..+"
      required
    />
    <button type="submit" class="example-submit">send</button>
  </form>
</template>

<script>
import SuperEmailField from './components/SuperEmailField.vue';

export default {
  name: 'App',
  components: {
    SuperEmailField,
  },
  data() {
    return {
      user: {
        email: '',
      },
    };
  },
};
</script>

<style>
body {
  font-family: Fira Sans, Roboto, sans-serif;
  background-color: #2e3283;
}

.example-form {
  background: #f5f6fa;
  position: relative;
  display: flex;
  box-shadow: 0 3px 5px rgb(0 0 0 / 30%);
  padding: 40px;
  justify-content: center;
  margin: 50px auto;
  max-width: 500px;
  flex-flow: column wrap;
  overflow: hidden;
}

.example-submit {
  background-color: #19d3a9;
  border-width: 0;
  border-radius: 4px;
  color: #2e3283;
  box-shadow: 0 3px 5px rgb(0 0 0 / 30%);
  font-size: 18px;
  outline: 0;
  padding: 16px;
  margin-top: 16px;
}

.example-submit:hover {
  cursor: pointer;
}

.example-form:invalid .example-submit {
  opacity: 0.5;
  pointer-events: none;
}
</style>
