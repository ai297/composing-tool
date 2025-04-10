<script setup>
import Konva from 'konva';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Uploader, Divider, showLoadingToast } from 'vant';
import { TOOLS_MIN_HEIGHT, TOOLS_MAX_HEIGHT, CANVA_SIZE,
  getState, layers, getLayers, addLayer, getFit,
  selectLayer, unselectLayer,
  getContentRelatedColors,
  saveStage
} from '@/core';
import Editor from '@/components/Editor.vue';
import Layers from '@/components/Layers.vue';
import MainTools from '@/components/MainTools.vue';
import ImageTools from '@/components/ImageTools.vue';

const TOOLS = [
  { component: MainTools, icon: 'edit', label: 'Tools' },
  { component: Layers, icon: 'points', label: 'Layers' },
  { component: ImageTools, icon: null, label: 'Adjust image' },
];

const router = useRouter();
const mainRef = ref(), actionBarRef = ref();
const activeTools = ref(0);
const toolsStyle = ref({});
const showSaveDialog = ref(false), fileName = ref(null), imageQuality = ref(0.8);

const changeScale = () => {
  if (!mainRef.value || !actionBarRef.value) return;

  const mainWidth = mainRef.value.clientWidth,
        mainHeight = mainRef.value.clientHeight,
        actionHeight = actionBarRef.value.$el.clientHeight,
        state = getState();

  state.setScale(Math.min(mainWidth / state.width, (mainHeight - actionHeight - TOOLS_MIN_HEIGHT) / state.height));

  const toolsMaxHeight = Math.min(TOOLS_MAX_HEIGHT, Math.round((mainHeight - actionHeight - state.height * state.scale) * CANVA_SIZE));
  const toolsMinHeight = Math.max(TOOLS_MIN_HEIGHT, Math.round(toolsMaxHeight / 2));
  toolsStyle.value['min-height'] = `${toolsMinHeight}px`;
  toolsStyle.value['max-height'] = `${Math.max(toolsMinHeight, toolsMaxHeight)}px`;
};

const fileSelectedHandler = (file) => {
  if (!file?.content) return;

  const image = new Image();
  const loader = showLoadingToast({
    message: 'Load image...',
    forbidClick: true,
  });

  image.addEventListener('load',
    () => {
      const state = getState();
      const imageName = file.file?.name ?? `photo-${getLayers().length + 1}`;
      const imageFit = getFit(image, state.width, state.height);

      addLayer(new Konva.Image({
        image,
        name: imageName,
        scale: imageFit.scale,
        ...imageFit.position,
      }),
      'photo',
      imageName,
      { mode: 'fit' });

      loader.close();
      fileName.value = !fileName.value
        ? (!!file.file?.name ? `${file.file.name}-edited` : imageName)
        : 'new-composed-image';
    },
    { once: true });

  image.src = file.content;
};

const layerSelectedHandler = (layer) => {
  selectLayer(layer);

  if (layer?.object instanceof Konva.Image)
    activeTools.value = 2;
};

const layerUnselectedHandler = () => {
  if (activeTools.value > 1)
    activeTools.value = 0;

  unselectLayer();
};

const layersUpdatedHandler = (layer) => {
  const state = getState();
  const suggestedBgColors = getContentRelatedColors(layer);
  state.bgColors.splice(2, state.bgColors.length, ...suggestedBgColors);
};

const saveChangesHandler = () => {
  saveStage(getState().stage, fileName.value, imageQuality.value);
  router.push('/');
};

onMounted(() => {
  changeScale();
  window.addEventListener('resize', changeScale);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', changeScale);
});
</script>

<template>
  <main ref="mainRef">
    <div class="wrapper">
      <Editor :layers="layers" :transformer="getState().transformer" :size="CANVA_SIZE"
              :width="getState().width" :height="getState().height" :scale="getState().scale"
              @layer-selected="layerSelectedHandler"
              @layer-unselected="layerUnselectedHandler"
              @layers-updated="layersUpdatedHandler"
              @stage-mounted="s => getState().stage = s"/>
    </div>
    <van-cell-group id="tools-panel" :style="toolsStyle" :title="TOOLS[activeTools].label">
      <component :is="TOOLS[activeTools].component" />
      <Divider />
    </van-cell-group>
    <van-tabbar :border="false" :fixed="false" v-model="activeTools" ref="actionBarRef">
      <Uploader class="van-tabbar-item" accept="image/*" :after-read="fileSelectedHandler">
        <van-button type="success" round icon="plus" text="Add" class="main-button" />
      </Uploader>
      <van-tabbar-item v-for="tool in TOOLS.slice(0, 2)" :icon="tool.icon">{{ tool.label }}</van-tabbar-item>
      <div class="van-tabbar-item">
        <van-button round type="primary" icon="success" text="Save"
                    @click="() => showSaveDialog = true" />
      </div>
    </van-tabbar>
    <van-dialog v-model:show="showSaveDialog" title="Save image..." show-cancel-button
                cancelButtonText="Cancel" confirmButtonText="Save"
                @confirm="saveChangesHandler">
      <van-cell title="Quality:">
        <van-slider v-model="imageQuality" :min="0.1" :max="1" :step="0.05">
          <template #button>
            <van-button type="primary" plain round size="mini">{{ (imageQuality * 100).toFixed() }}%</van-button>
          </template>
        </van-slider>
      </van-cell>
    </van-dialog>
  </main>
</template>

<style>
#tools-panel {
  flex: 0 0 auto;
  overflow: hidden;
  overflow-y: auto;
}

</style>
