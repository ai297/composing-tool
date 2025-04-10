<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['stage-mounted', 'layer-selected', 'layer-unselected', 'layers-updated']);
const { transformer, layers, size, width, height, scale } = defineProps(['transformer', 'layers', 'size', 'width', 'height', 'scale']);
let stage = null;

const stageRef = ref();
const editorRef = ref();

const updateLayers = () => {
  const konvaLayer = stage.getLayers()[0];
  konvaLayer.removeChildren();

  layers.forEach(l => konvaLayer.add(l.object));
  konvaLayer.add(transformer);
  konvaLayer.draw();

  emit('layers-updated', konvaLayer);
};

const handleSelection = (evt) => {
  const targetId = evt.target.id();
  const layer = layers.find(l => l.id == targetId);

  if (!!layer && !layer.options.locked)
    emit('layer-selected', layer);
  else
    emit('layer-unselected')
};

watch(() => layers.length, (n, o) => n != o ? updateLayers() : null);

onMounted(() => {
  stage = stageRef.value.getStage();
  emit('stage-mounted', stage);

  updateLayers();
  stage.getLayers()[0].on('click tap', handleSelection);
});

onBeforeUnmount(() => {
  stage.getLayers()[0].off('click tap');
});

</script>

<template>
  <div ref="editorRef" class="editor flex-column center">
    <div class="konva-container" 
        :style="{
          width: `${Math.round(width * scale * size)}px`,
          height: `${Math.round(height * scale * size)}px`,
        }">
      <v-stage :config="{ width, height }"
               :style="{ width: `${width}px`, height: `${height}px`, transform: `scale(${scale * size})` }"
                ref="stageRef">
        <v-layer />
      </v-stage>
    </div>
  </div>
</template>

<style>
.editor {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.konva-container > div {
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.2);
  transform-origin: top left;
}
</style>
