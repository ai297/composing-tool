<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { getState, getFit, getFill } from '@/core';

const FIT = 'fit',
      FILL = 'fill',
      FRAME = 'frame',
      NONE = 'none';

const configureFrame = ref(getState().selectedLayer.options.mode == FRAME);

const fit = () => {
  const state = getState();
  const konvaImg = state.selectedLayer.object;
  const fit = getFit(konvaImg.size(), state.width, state.height);

  konvaImg.rotation(0);
  konvaImg.scale(fit.scale);
  konvaImg.position(fit.position);
};

const fill = () => {
  const state = getState();
  const konvaImg = state.selectedLayer.object;
  const fill = getFill(konvaImg.size(), state.width, state.height);

  konvaImg.rotation(0);
  konvaImg.scale(fill.scale);
  konvaImg.position(fill.position);
};

const frame = () => {
  const state = getState();
  const konvaImg = state.selectedLayer.object;
  const fit = getFit(konvaImg.size(), state.width, state.height, state.selectedLayer.options.frameSize);

  konvaImg.rotation(0);
  konvaImg.scale(fit.scale);
  konvaImg.position(fit.position);
};

onMounted(() => {
  const state = getState();
  state.selectedLayer?.object.on('transform.tool dragmove.tool', () => state.selectedLayer.options.mode = NONE);
  state.selectedLayer.options.frameSize ??= 0.1;
});

onBeforeUnmount(() => getState().selectedLayer?.object.off('transform.tool dragmove.tool'));
watch(() => getState().selectedLayer.options.mode, (newVal) => configureFrame.value = newVal == FRAME);
watch(() => getState().selectedLayer.options.frameSize, () => getState().selectedLayer.options.mode == FRAME && frame());

</script>

<template>
  <div class="flex-row tool-wrapper" v-if="configureFrame">
    <van-slider v-model="getState().selectedLayer.options.frameSize" :min="0.05" :max="0.5" :step="0.05">
      <template #button>
        <van-button type="primary" plain round size="mini">{{ (getState().selectedLayer.options.frameSize * 100).toFixed() }}%</van-button>
      </template>
    </van-slider>
  </div>
  <van-tabbar :fixed="false" v-model="getState().selectedLayer.options.mode">
    <van-tabbar-item :name="FIT" icon="expand-o" @click="fit">Fit</van-tabbar-item>
    <van-tabbar-item :name="FILL" icon="shrink" @click="fill">Fill</van-tabbar-item>
    <van-tabbar-item :name="FRAME" icon="enlarge" @click="frame">Frame</van-tabbar-item>
  </van-tabbar>
</template>
