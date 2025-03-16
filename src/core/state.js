import { ref } from "vue";

const state = ref({
  image: null,
});

const useState = () => state.value;

export { state, useState };

export default state;
