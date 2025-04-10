<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { initState } from '@/core';

const router = useRouter();

const CUSTOM = 'custom';
const selectedSize = ref('inst-vert');
const imageSizes = ref({
  'inst-vert': { width: 1080, height: 1350, name: 'Instagram post (vertical)' },
  'inst-sq': { width: 1080, height: 1080, name: 'Instagram post (square)' },
  [CUSTOM]: { width: 0, height: 0, name: 'Custom...' },
});

const changeSize = (key) => {
  selectedSize.value = key;
}

const goToEditor = () => {
  const imageSize = imageSizes.value[selectedSize.value];
  initState(Number(imageSize.width), Number(imageSize.height));

  router.push('/edit');
};

</script>

<template>
  <main>
    <div class="wrapper flex-column center">
      <van-radio-group class="options" v-model="selectedSize">
        <van-cell-group inset title="Presets">
          <van-cell clickable
                    v-for="(preset, key) in imageSizes"
                    :title="preset.name"
                    :label="preset.width + ' x ' + preset.height"
                    @click="() => changeSize(key)">
            <template #right-icon>
              <van-radio :name="key" />
            </template>
          </van-cell>
          <van-field v-model="imageSizes[CUSTOM].width" type="digit" label="Width" v-if="selectedSize == CUSTOM"/>
          <van-field v-model="imageSizes[CUSTOM].height" type="digit" label="Height" v-if="selectedSize == CUSTOM"/>
        </van-cell-group>
      </van-radio-group>
    </div>
    <van-tabbar :border="false" :fixed="false">
      <van-tabbar-item>
        <van-button type="primary" icon="photo-o" text="Create" round
                    :disabled="!(imageSizes[selectedSize].width > 0 && imageSizes[selectedSize].height > 0)"
                    @click="goToEditor"
                    class="main-button"/>
      </van-tabbar-item>
    </van-tabbar>
  </main>
</template>

<style>
.options { width: calc(100% - 2em); }

.switch-icon {
  width: 100%;
  height: 100%;
  font-size: .75em;
  line-height: 1.5em;
}

</style>
