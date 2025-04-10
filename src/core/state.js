import Konva from 'konva';
import { reactive, ref } from "vue";

const TRANSFORMER_COLOR = '#00FF00';
const LIGHT = 'light', DARK = 'dark';

export const theme = ref(LIGHT);
export const switchTheme = (useDarkTheme) => theme.value = (useDarkTheme ?? theme.value == LIGHT) ? DARK : LIGHT;

let state = {};
export const getState = () => state;

export const layers = ref([]);
export const getLayers = () => layers.value;

export const initState = (width, height) => {
  state = reactive({
    width: width,
    height: height,
    scale: 1,
    bgColor: '#ffffff',
    bgColors: ['#ffffff', '#000000'],
    stage: null,
    transformer: new Konva.Transformer({
      flipEnabled: false,
      anchorFill: TRANSFORMER_COLOR, anchorStroke: TRANSFORMER_COLOR, borderStroke: TRANSFORMER_COLOR,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    }),
    selectedLayer: null,
    setScale: (scale) => {
      state.scale = scale;
      state.transformer.anchorSize(Math.round(state.transformer.anchorSize() / scale));
      state.transformer.borderStrokeWidth(Math.round(state.transformer.borderStrokeWidth() / scale));
      state.transformer.anchorStrokeWidth(Math.round(state.transformer.anchorStrokeWidth() / scale));
    },
  });

  layers.value = [];
  addLayer(new Konva.Rect({ x: 0, y: 0, width, height, fill: state.bgColor, name: 'background' }),
    'circle', 'background', { locked: true });
    
  return state;
};

const createLayer = (object, icon, label, options) => {
  return {
    get id() { return object.id(); },
    get object() { return object; },
    get icon() { return icon; },
    get label() { return label; },
    get options() { return options; },
  };
};

export const findLayer = (label) => {
  const index = layers.value.findIndex(l => l.label == label);

  return index < 0
    ? { layer: null, index }
    : { layer: layers.value[index], index };
};

export const addLayer = (object, icon, label, options = { }) => {
  const resolvedOptions = {
    locked: false,
    selected: false,
    ...options
  };

  const layer = createLayer(object, icon, label, resolvedOptions);
  const totalLayers = layers.value.push(layer);

  object.id(`layer#${totalLayers}`);

  return layer;
};

export const unselectLayer = () => {
  if (!state.selectedLayer)
    return;

  if (state.selectedLayer.object instanceof Konva.Image) {
    state.selectedLayer.object.setAttrs({ draggable: false });
    state.selectedLayer.object.off('transform dragmove');
  }

  state.selectedLayer.options.selected = false;
  state.selectedLayer = null;
  state.transformer.nodes([]);
};

export const selectLayer = (layer) => {
  unselectLayer();

  if (!layer) return;

  state.selectedLayer = layer;
  state.transformer.nodes([layer.object]);
  layer.options.selected = true;

  if (layer.object instanceof Konva.Image) {
    layer.object.setAttrs({ draggable: true });

    layer.object.on('transform', () => {
      // do not enlarge images
      if (layer.object.scaleX() > 1 || layer.object.scaleY() > 1)
        layer.object.scale({ x: 1, y: 1 });
    });

    // layer.object.on('dragmove', (evt) => {
    //   console.log('move:', evt);
    // });
  }
};

export const deleteLayer = (layer = null) => {
  layer = layer ?? state.selectedLayer;

  if (state.selectedLayer == layer)
    unselectLayer();

  const index = layers.value.indexOf(layer);
  layers.value.splice(index, 1);
};
