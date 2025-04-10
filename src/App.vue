<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ConfigProvider, NavBar, Switch, Image, showConfirmDialog } from 'vant';
import { theme, switchTheme } from '@/core';

const route = useRoute();
const router = useRouter();

const useDarkTheme = ref(false);;

const goHomeHandler = () => route.path != '/' && showConfirmDialog({
  title: 'Dismiss changes',
  message: 'All changes will be lost. Return to the start page?',
  confirmButtonText: 'Yes',
  cancelButtonText: 'No',
}).then(() => router.push('/'));

</script>

<template>
  <ConfigProvider id="config-wrapper" :theme="theme">
    <NavBar title="Photo Composing Tool" id="app-header">
      <template #left>
        <Image src="./icons/icon-32x32.png" fit="cover" width="32px" height="32px" round @click="goHomeHandler"/>
      </template>
      <template #right>
        <Switch v-model="useDarkTheme" @change="switchTheme">
          <template #node>
            <div class="switch-icon">{{ useDarkTheme ? '🌙' : '☀️' }}</div>
          </template>
        </Switch>
      </template>
    </NavBar> 
    <RouterView />
  </ConfigProvider>
</template>

<style>
#config-wrapper {
  width: 100%;
  height: 100%;
}
</style>
