<script setup>
import { ref } from 'vue';
import { Grid, GridItem } from 'vant';
import { useState } from '@/core/state';
import Editor from '@/components/Editor.vue';

const editorModel = ref({image: useState().image});

const downloadURI = (uri, name) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const saveHandler = () => {
  const stage = editorModel.value.getStage();
  if (!stage) return;

  const dataURL = stage.toDataURL({
    mimeType: 'image/jpeg',
    quality: 0.7,
    imageSmoothingEnabled: false,
  });

  downloadURI(dataURL, 'my-image.jpg');
};

</script>

<template>
  <main>
    <div class="editor-wrapper">
      <Editor v-model="editorModel"/>
    </div>
    <Grid :column-num="1">
      <GridItem>
        <van-button type="primary" icon="success" round @click="saveHandler">Save</van-button>
      </GridItem>
    </Grid>
  </main>
</template>

<style>
.editor-wrapper {
  flex-grow: 1;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
