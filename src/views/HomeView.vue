<script setup>
import { useRouter } from 'vue-router';
import { Uploader } from 'vant';
import state from '@/core/state';

const router = useRouter();
const goToEditor = () => router.push('/edit');

const fileSelectedHandler = (file) => {
  if (!file?.content) return;

  state.value.image = new Image();
  state.value.image.addEventListener('load', goToEditor, { once: true });
  state.value.image.src = file.content;
};

</script>

<template>
  <main class="center">
    <Uploader accept="image/*" :after-read="fileSelectedHandler" />
  </main>
</template>