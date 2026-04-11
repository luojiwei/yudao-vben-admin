const color = '#1677ff';

export const POLYGON_OPTIONS = {
  strokeColor: color,
  strokeWeight: 2,
  fillColor: color,
  fillOpacity: 0.1,
};

export const POLYLINE_OPTIONS = {
  strokeColor: color,
  strokeWeight: 2,
};

export const getPolygonCenter = (points: any[]) => {
  if (!points || points.length < 3 || !window.BMapGL || !window.BMapGL.Point)
    return null;

  let area = 0;
  let cx = 0;
  let cy = 0;
  const len = points.length;

  for (let i = 0; i < len; i++) {
    const j = (i + 1) % len;
    const a = points[i].lng * points[j].lat - points[j].lng * points[i].lat;
    area += a;
    cx += (points[i].lng + points[j].lng) * a;
    cy += (points[i].lat + points[j].lat) * a;
  }

  area *= 0.5;
  cx = cx / (6 * area);
  cy = cy / (6 * area);

  return new window.BMapGL.Point(cx, cy);
};

export function fitPolygonToView(map: any, points: any[]) {
  if (
    !map ||
    !points ||
    points.length < 3 ||
    !window.BMapGL ||
    !window.BMapGL.Point
  )
    return null;

  // 计算最大/最小经纬度
  const lngs = points.map((p) => p.lng);
  const lats = points.map((p) => p.lat);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // 创建西南、东北角，构建视野范围
  const sw = new window.BMapGL.Point(minLng, minLat);
  const ne = new window.BMapGL.Point(maxLng, maxLat);

  // 百度地图GL 自带自适应视野（自带最佳zoom + 留白）
  map.setViewport([sw, ne], {
    margins: [50, 50, 50, 50], // 上下左右留白 50px
  });
}

export const createDotMarker = () => {
  if (!window.BMapGL || !window.BMapGL.Icon) return null;
  const url =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSIjMTY3N2ZmIi8+PC9zdmc+';
  return new window.BMapGL.Icon(url, new window.BMapGL.Size(4, 4), {
    anchor: new window.BMapGL.Size(1, 1),
  });
};
