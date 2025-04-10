<script setup>
const { name, color, selected } = defineProps(['name', 'color', 'selected']);
const emit = defineEmits(['select']);

const handleSelection = (e) => {
  e.stopPropagation();
  emit('select', color);
};

</script>

<template>
  <label class="color-selector">
    <input type="radio" :name="name" :checked="selected" @change="handleSelection" />
    <span class="color-mark" :style="{ backgroundColor: color}"></span>
  </label>
</template>

<style>
.color-selector {
  display: block;
  position: relative;
  width: 1.75em;
  height: 1.75em;
  border: 1px solid var(--van-text-color);
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.color-selector input {
  display: none;
}

.color-selector .color-mark {
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border: 3px solid var(--van-background-2);
  border-radius: 50%;
}

.color-selector input:checked ~ .color-mark {
  border-color: var(--van-primary-color);
}

</style>