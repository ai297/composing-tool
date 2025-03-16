<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const model = defineModel();

const WIDTH = 1080;
const HEIGHT = 1350;

const stageRef = ref();
const editorRef = ref();
const wrapperStyle = ref({ width: `${WIDTH}px`, height: `${HEIGHT}px`, transform: `scale(0)` });
const backgroundRectConfig = ref({ x: 0, y: 0, width: WIDTH, height: HEIGHT, fill: '#ffffff' });
const imageConfig = ref({ image: null });
const showImage = ref(false);

const updateScale = () => {
  if (!editorRef.value) return;

  const { clientWidth, clientHeight } = editorRef.value;
  const scale = Math.min(clientWidth / WIDTH, clientHeight / HEIGHT) * 0.9;
  wrapperStyle.value.transform = `scale(${scale})`;
};

onMounted(() => {
  updateScale();
  window.addEventListener('resize', updateScale);

  if (!model.value.image) return;

  model.value.getStage = stageRef.value.getStage;
  imageConfig.value = {
    image: model.value.image,
    x: (WIDTH - model.value.image.width) / 2,
    y: (HEIGHT - model.value.image.height) / 2,
  };

  showImage.value = true;
});

onBeforeUnmount(() => window.removeEventListener('resize', updateScale));

</script>

<template>
  <div ref="editorRef" class="editor">
    <v-stage :config="{ width: WIDTH, height: HEIGHT }" :style="wrapperStyle" ref="stageRef">
      <v-layer>
        <v-rect :config="backgroundRectConfig"/>
        <v-image :config="imageConfig"
        v-if="showImage"/>
      </v-layer>
    </v-stage>
  </div>
</template>

<style>
.editor {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor > div {
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.2);
}
</style>
