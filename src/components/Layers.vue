<script setup>
import { layers, deleteLayer } from '@/core';

</script>

<template>
  <van-cell-group>
    <van-swipe-cell v-for="(l, i) in layers.slice().reverse()" >
      <van-cell :icon="l.icon" :title="l.label" :clickable="!l.options.locked">
        <van-icon name="lock" v-if="l.options.locked" />
      </van-cell>
      <template #right v-if="!l.options.locked">
        <van-button square type="danger" icon="delete" @click="() => deleteLayer(l)" />
        <!-- <van-button square type="primary" icon="arrow-up" />
        <van-button square type="primary" icon="arrow-down" /> -->
      </template>
    </van-swipe-cell>
  </van-cell-group>
</template>
