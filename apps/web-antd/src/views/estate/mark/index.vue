<script setup lang="ts">
import type { EstateMark } from '#/api/estate';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getEstateMark, updateEstateMark } from '#/api/estate';
import {
  createDotMarker,
  fitPolygonToView,
  getPolygonCenter,
  POLYGON_OPTIONS,
  POLYLINE_OPTIONS,
} from '#/components/baidu-map';
import { loadBaiduMapSdk } from '#/components/map/src/utils';

const DEFAULT_CENTER = {
  longitude: 115.877_233,
  latitude: 28.657_595,
}; // 默认坐标

const route = useRoute();
const routeId = ref<number>(0);
const mapContainerRef = ref<HTMLElement>();
const map = ref<any>();
const markData = ref<EstateMark>({} as EstateMark); // 小区标记信息
const isDrawingPolygon = ref<boolean>(false); // 是否绘制模式
const inDrawing = ref<boolean>(false); // 是否正在绘制
const oldPolygonPoints = ref<any[]>([]); // 旧的多边形节点
const polygonPoints = ref<any[]>([]); // 当前多边形节点
const currentPolygon = ref<any>(null); // 当前多边形对象
const tempOverlay = ref<any>(null); // 临时图形对象

/**
 * 小区中心坐标
 */
const center = computed(() => {
  // 如果有小区标记信息则使用小区标记信息的坐标，否则使用默认坐标
  const longitude =
    markData.value.longitude && markData.value.longitude > 0
      ? markData.value.longitude
      : DEFAULT_CENTER.longitude;
  const latitude =
    markData.value.latitude && markData.value.latitude > 0
      ? markData.value.latitude
      : DEFAULT_CENTER.latitude;
  return {
    longitude,
    latitude,
  };
});

/**
 * 绘制旧的多边形
 */
const drawOriginalPolygon = () => {
  if (oldPolygonPoints.value.length === 0) return;
  oldPolygonPoints.value.forEach((item) => {
    polygonPoints.value.push(new window.BMapGL.Point(item[0], item[1]));
  });
  currentPolygon.value = new window.BMapGL.Polygon(
    polygonPoints.value,
    POLYGON_OPTIONS,
  );
  map.value.addOverlay(currentPolygon.value);
  // 调整地图视图，使多边形可见
  fitPolygonToView(map.value, polygonPoints.value);
};

/**
 * 初始化地图
 */
const initMap = async () => {
  if (!mapContainerRef.value) return;

  await loadBaiduMapSdk();

  map.value = new window.BMapGL.Map(mapContainerRef.value);
  const point = new window.BMapGL.Point(
    center.value.longitude,
    center.value.latitude,
  );
  map.value.centerAndZoom(point, 16);
  map.value.enableScrollWheelZoom(true);

  if (oldPolygonPoints.value.length > 0) {
    // 如果有旧的多边形节点，绘制旧的多边形
    drawOriginalPolygon();
  }
};

/**
 * 获取小区标记信息
 */
const getDetailData = async () => {
  const res = await getEstateMark(routeId.value);
  markData.value = res;
  if (!res.locationJson) return;
  const locationJson = JSON.parse(res.locationJson);
  if (locationJson && typeof locationJson === 'object') {
    // 解析多边形节点，赋值给旧的多边形节点
    oldPolygonPoints.value = locationJson;
  }
};

/**
 * 监听地图左键点击事件
 */
const onPolygonClick = (e: any) => {
  // 如果没有开始绘制，则不进行操作
  if (!inDrawing.value) return;
  const { lng, lat } = e.latlng;
  const p = new window.BMapGL.Point(lng, lat);
  // 将点击坐标添加入当前多边形节点
  polygonPoints.value.push(p);

  if (polygonPoints.value.length === 1) {
    // 当只有一个节点时，只绘制一个点标记
    tempOverlay.value = new window.BMapGL.Marker(p, {
      icon: createDotMarker(),
    });
    map.value.addOverlay(tempOverlay.value);
  } else if (polygonPoints.value.length === 2) {
    // 当有两个节点时，绘制一个折线
    map.value.removeOverlay(tempOverlay.value);
    tempOverlay.value = new window.BMapGL.Polyline(
      polygonPoints.value,
      POLYLINE_OPTIONS,
    );
    map.value.addOverlay(tempOverlay.value);
  } else {
    // 当有三个以上节点时，绘制一个多边形
    map.value.removeOverlay(tempOverlay.value);
    if (currentPolygon.value) {
      // 如果已经存在多边形对象，更新多边形路径
      currentPolygon.value.setPath(polygonPoints.value);
    } else {
      // 如果不存在多边形对象，创建一个新的多边形对象
      currentPolygon.value = new window.BMapGL.Polygon(
        polygonPoints.value,
        POLYGON_OPTIONS,
      );
      map.value.addOverlay(currentPolygon.value);
    }
  }
};

/**
 * 监听地图鼠标移动事件
 */
const onMouseMove = (e: any) => {
  // 如果没有开始绘制，或者当前多边形节点为空，则不进行操作
  if (!inDrawing.value || polygonPoints.value.length === 0) return;
  const { lng, lat } = e.latlng;
  const p = new window.BMapGL.Point(lng, lat);
  // 将当前多边形节点和鼠标移动坐标合并为一个临时节点数组
  const tempPoints = [...polygonPoints.value, p];
  // 如果存在临时图形对象，则先移除
  tempOverlay.value && map.value.removeOverlay(tempOverlay.value);

  if (tempPoints.length === 2) {
    // 当只有两个节点时，绘制一个折线
    tempOverlay.value = new window.BMapGL.Polyline(
      tempPoints,
      POLYLINE_OPTIONS,
    );
    map.value.addOverlay(tempOverlay.value);
  } else if (tempPoints.length === 3) {
    // 当有三个节点时，绘制一个多边形
    tempOverlay.value = new window.BMapGL.Polygon(tempPoints, POLYGON_OPTIONS);
    map.value.addOverlay(tempOverlay.value);
  } else {
    // 当有三个以上节点时，更新当前多边形对象路径
    currentPolygon.value.setPath(tempPoints);
  }
};

/**
 * 重置绘制
 */
const resetPolygonDraw = () => {
  currentPolygon.value && map.value.removeOverlay(currentPolygon.value);
  tempOverlay.value && map.value.removeOverlay(tempOverlay.value);
  currentPolygon.value = null;
  polygonPoints.value = [];
  map.value.removeEventListener('click', onPolygonClick);
  map.value.removeEventListener('mousemove', onMouseMove);
  map.value.removeEventListener('rightclick', onPolygonFinish);
};

/**
 * 取消绘制
 */
const handleCancel = () => {
  resetPolygonDraw();
  isDrawingPolygon.value = false;
  drawOriginalPolygon();
};

/**
 * 完成绘制
 */
function onPolygonFinish() {
  inDrawing.value = false;
  if (polygonPoints.value.length < 3) {
    message.error('至少需要3个点');
    handleCancel();
    return;
  }
  currentPolygon.value.setPath(polygonPoints.value);
}

/**
 * 开始绘制
 */
const startDrawPolygon = () => {
  if (isDrawingPolygon.value) return;
  isDrawingPolygon.value = true;
  inDrawing.value = true;
  resetPolygonDraw();

  // 点击添加点
  map.value.addEventListener('click', onPolygonClick);
  // 鼠标移动事件
  map.value.addEventListener('mousemove', onMouseMove);
  // 右键完成
  map.value.addEventListener('rightclick', onPolygonFinish);
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-1',
    labelWidth: 80,
  },
  layout: 'vertical',
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      fieldName: 'value',
      label: '小区范围坐标',
      component: 'Textarea',
      componentProps: {
        placeholder: `请输入小区范围坐标，经度和纬度之间用英文逗号隔开，一个坐标一行，最少3个坐标，例：
114.314521,22.543021
114.314521,22.543021
114.314521,22.543021
114.314521,22.543021
`,
        rows: 6,
      },
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const data = await formApi.getValues();
    if (!data.value) {
      message.error('请输入小区范围坐标!');
      return;
    }
    if (!data.value.includes('\n') || !data.value.includes(',')) {
      message.error('坐标格式不正确!');
      return;
    }
    const points = data.value.split('\n');
    if (points.length < 3) {
      message.error('至少需要3个坐标!');
      return;
    }
    resetPolygonDraw();
    polygonPoints.value = points.map((item: string) => {
      const [lng, lat] = item.split(',');
      return new window.BMapGL.Point(Number(lng), Number(lat));
    });
    currentPolygon.value = new window.BMapGL.Polygon(
      polygonPoints.value,
      POLYGON_OPTIONS,
    );
    map.value.addOverlay(currentPolygon.value);
    fitPolygonToView(map.value, polygonPoints.value);
    message.success('绘制成功');
    modalApi.close();
  },
});

const handleInput = () => {
  modalApi.open();
};

const handleSave = async () => {
  const center = getPolygonCenter(polygonPoints.value);
  const polygonPath = polygonPoints.value.map((item) => [item.lng, item.lat]);
  await updateEstateMark({
    id: routeId.value,
    latitude: center.lat,
    longitude: center.lng,
    locationJson: JSON.stringify(polygonPath),
  });
  message.success('提交成功');
  resetPolygonDraw();
  isDrawingPolygon.value = false;
  await getDetailData();
  drawOriginalPolygon();
};

onMounted(async () => {
  if (route.query.id) {
    routeId.value = Number(route.query.id);
    await getDetailData();
    initMap();
  }
});
</script>

<template>
  <div class="estate-scope-mark">
    <div ref="mapContainerRef" style="width: 100%; height: 100%"></div>
    <div class="map-content">
      <div class="left-top-card">
        <div class="estate-name">{{ markData.name }}</div>
        <div class="estate-center">
          小区经纬度：{{ markData.longitude }}, {{ markData.latitude }}
        </div>
        <div class="operate-tips">
          <div class="tips-item">1. 点击开始绘制按钮进入绘制模式</div>
          <div class="tips-item">
            2.
            在地图上沿着小区轮廓顺时针或逆时针单击左键添加节点，单击右键完成绘制
          </div>
          <div class="tips-item">3. 按住鼠标滚轮可拖动地图</div>
          <div class="tips-item">4. 点击完成绘制按钮，保存小区范围标记</div>
        </div>
      </div>
      <div class="action-btns">
        <a-button
          v-if="!isDrawingPolygon"
          type="primary"
          @click="startDrawPolygon"
        >
          开始绘制
        </a-button>
        <template v-else>
          <a-button type="primary" class="input-btn" @click="handleInput">
            手动输入
          </a-button>
          <a-button type="primary" @click="handleSave">完成绘制</a-button>
          <a-button type="primary" class="cancel-btn" @click="handleCancel">
            取消
          </a-button>
        </template>
      </div>
    </div>
    <Modal title="手动输入小区范围坐标">
      <Form />
    </Modal>
  </div>
</template>

<style scoped lang="scss">
.estate-scope-mark {
  position: relative;
  height: 100%;
}

.left-top-card {
  position: absolute;
  width: 350px;
  top: 5px;
  left: 5px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fff;
  z-index: 999;

  .estate-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .estate-center {
    font-size: 14px;
    margin-bottom: 10px;
  }
}

.action-btns {
  position: absolute;
  left: 50%;
  bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  transform: translateX(-50%);
  z-index: 999;

  .input-btn {
    background-color: #0bd092;
    &:hover {
      background-color: #31dfa8;
    }
  }
  .cancel-btn {
    background-color: #ff4d4f;
    &:hover {
      background-color: #fd5f62;
    }
  }
}
</style>
