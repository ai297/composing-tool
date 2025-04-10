<script setup>
import { ref } from 'vue';
import { getState, findLayer } from '@/core';
import ColorsPalete from './ColorsPalete.vue';

const activeTool = ref('background');
const handleBgChanged = (newVal) => findLayer('background').layer?.object.fill(newVal);

</script>

<template>
  <div class="flex-column tool-wrapper" v-if="activeTool == 'background'">
    <colors-palete :colors="getState().bgColors" v-model="getState().bgColor" @changed="handleBgChanged"/>
  </div>
  <van-tabbar :fixed="false" v-model="activeTool">
    <van-tabbar-item name="background" icon="circle" >Background</van-tabbar-item>
  </van-tabbar>
</template>
