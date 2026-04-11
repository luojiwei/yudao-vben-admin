<script lang="ts" setup>
import { ref } from 'vue';

defineOptions({ name: 'SliderCaptcha' });

const emit = defineEmits(['success', 'failed']);

const leftP = ref('0');
const blockState = ref(0);
const startP = ref<{ clientX: number }>({
  clientX: 0,
});
const sliderContainer = ref(undefined);

const onMouseDown = (e: any) => {
  if (blockState.value === 2) {
    leftP.value = '0';
    blockState.value = 0;
  } else {
    leftP.value = '0';
    blockState.value = 1;
    startP.value = {
      clientX: e.clientX,
    };
  }
};

const onMouseMove = (e: any) => {
  if (blockState.value === 1) {
    const width = e.clientX - startP.value.clientX;
    if (width + 52 > 384) {
      leftP.value = `${384 - 52}px`;
      blockState.value = 2;
      emit('success', true);
    } else {
      leftP.value = `${width}px`;
    }
  }
};

const onMouseUp = () => {
  if (blockState.value !== 2) {
    leftP.value = '0';
    blockState.value = 0;
    emit('failed');
  }
};

const onMouseLeave = () => {
  if (blockState.value !== 2) {
    leftP.value = '0';
    blockState.value = 0;
    emit('failed');
  }
};
</script>

<template>
  <div
    ref="sliderContainer"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    class="slider-verify-container"
    @mouseleave="onMouseLeave"
  >
    <template v-if="blockState !== 2">
      <span>拖动滑块验证</span>
      <div
        @mousedown="onMouseDown"
        :style="{ left: leftP }"
        class="slider-verify-block"
      ></div>
    </template>
    <div v-else :style="{ left: leftP }" class="slider-verify-succ"></div>
    <div :style="{ width: leftP }" class="slider-verify-complete">
      <span v-if="blockState === 2">验证通过</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider-verify-container {
  position: relative;
  width: 100%;
  height: 40px;
  margin-bottom: 12px;
  overflow: hidden;
  line-height: 40px;
  color: #636363;
  text-align: center;
  user-select: none;
  background-color: #ededed;
  border: solid 1px #ededed;
  border-radius: 8px;
}

.slider-verify-complete {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 40px;
  color: #fff;
  background-color: hsl(var(--primary));
}

.slider-verify-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 52px;
  height: 40px;
  background-color: white;
  background-image: url('../../assets/images/huakuaih.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 40%;
}

.slider-verify-succ {
  position: absolute;
  top: 0;
  left: 0;
  width: 52px;
  height: 40px;
  background-color: white;
  background-image: url('../../assets/images/succ.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 40%;
}
</style>
