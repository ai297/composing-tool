<script setup>
import ColorSelector from './ColorSelector.vue';

const { name, colors } = defineProps(['name', 'colors']);
const emit = defineEmits(['changed']);
const model = defineModel();
const cName = `cp_${Math.random()}`;

const handleSelect = (val) => {
  if (model.value != val) {
    model.value = val;
    emit('changed', val);
  }
}

</script>

<template>
  <div class="colors-palete">
    <color-selector :name="name ?? cName"
                    v-for="c in colors"
                    :color="c"
                    :selected="c == model"
                    @select="handleSelect"/>
  </div>
</template>

<style>
.colors-palete {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.colors-palete > * {
  flex: 0 0 auto;
  margin: 0 2px;
}
</style>
