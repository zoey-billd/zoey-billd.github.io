# Heightfield Terrain H21 V1

## 1. 资产概览

这是一个 Houdini 21 高程地形场景，流程包含基础 HeightField、分形山地噪声、液压侵蚀和坡度/高度特征遮罩。输出可作为 Houdini 地形预览，也可通过 UE Landscape 材质和 layer 命名约定进入 Houdini Engine。

## 2. 文件与要求

- 场景：[heightfield_terrain_h21_v1.hip](heightfield_terrain_h21_v1.hip)
- Houdini：`21.0.631`
- 外层网络：`/obj/heightfield_terrain_h21_authoring`
- HDA 节点：`/obj/heightfield_terrain_h21_authoring/HEIGHTFIELD_TERRAIN_H21_V1`
- 主输出：`/obj/heightfield_terrain_h21_authoring/OUT_PREVIEW_HEIGHTFIELD_TERRAIN_H21`
- 相关预览：[heightfield_terrain_h21_v1_preview.png](../analysis/heightfield_terrain_h21_v1_preview.png)
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)

HDA 定义保存在 HIP 的 Embedded 区域。独立工程使用时，建议同时安装对应的 `billd::heightfield_terrain_h21::1.0` HDA。

## 3. 快速使用

1. 打开 HIP，进入 `/obj/heightfield_terrain_h21_authoring`。
2. 在 `HEIGHTFIELD_TERRAIN_H21_V1` 上调整参数。
3. 查看 `OUT_PREVIEW_HEIGHTFIELD_TERRAIN_H21` 的 volume layer。
4. UE 使用时，将 `unreal_landscape_material` 填为目标材质，并通过 layer 名称映射 Landscape paint layers。

## 4. 主要参数

### 地形尺寸

- `terrain_size_x`、`terrain_size_z`：当前为 `1008 x 1008`。
- `grid_spacing`：当前为 `1.0`。
- `initial_height`、`vertical_scale`：初始高度和垂直比例。
- `output_stage`：选择输出阶段。
- `seed`：当前为 `74`。

### 噪声与侵蚀

- `noise_amplitude`：当前为 `92.0`。
- `noise_element_size`、`noise_octaves`、`noise_roughness`：控制山体形状和细节层次。
- `enable_erosion`：当前开启。
- `erosion_iterations`、`erosion_scale`、`flow_strength`：控制侵蚀强度和水流效果。
- `erosion_strength`、`deposition_strength`、`weathering_strength`：控制冲刷、沉积和风化。

### Mask 与 UE

- `build_feature_mask`：生成地形特征遮罩。
- `mask_min_slope`、`mask_max_slope`：当前为 `24` 到 `78` 度。
- `mask_min_height`、`mask_max_height`：高度范围筛选。
- `unreal_landscape_material`：当前为 `/Game/Materials/M_HeightfieldLandscape.M_HeightfieldLandscape`。
- `unreal_layer_prefix`：当前为 `terrain`。

## 5. 节点逻辑

```text
BASE_HEIGHTFIELD_H21
  -> FRACTAL_MOUNTAIN_NOISE
  -> HYDRAULIC_EROSION_H21
  -> SLOPE_HEIGHT_FEATURE_MASK
  -> OUT_PREVIEW_HEIGHTFIELD_TERRAIN_H21
```

外层 `heightfield_terrain_h21_authoring` 只是测试包装，真正的控制参数和内部节点位于 HDA 内部。

## 6. 输出

| 输出 | 用途 | 当前保存帧统计 |
|---|---|---:|
| `OUT_PREVIEW_HEIGHTFIELD_TERRAIN_H21` | HeightField volume 预览和 UE 地形输入 | 7 prims / 7 points / 7 vertices |

当前包围盒约为 `(-504, -13.981, -504)` 到 `(504, 19.883, 504)`。当前 layer 名称为：`height`、`mask`、`debris`、`sediment`、`flow`、`flowdir.x`、`flowdir.y`。

## 7. 属性与数据约定

- Primitive attribute：`name`
- 主要 volume layer：`height`、`mask`、侵蚀相关层。
- UE 侧应根据 `unreal_layer_prefix` 和实际 `name` 值配置 Landscape layer 映射。

## 8. 动画与时间轴

- 场景范围：1-240 帧，24 fps。
- 当前保存帧：71。
- 当前网络不是以时间轴生长为主，修改参数或 seed 后重新 cook 即可得到新的地形。

## 9. 材质与视口

场景没有独立 `/mat` 材质网络；材质主要通过 HDA 参数和输出属性传递。UE 材质字符串不代表本地工程中一定存在对应资源。

## 10. 验证

- HIP 可以由 Houdini 21.0.631 打开。
- 输出成功生成 7 个 volume primitive。
- 当前没有 node error。
- Houdini 报告 5 条警告：HDA 定义不完整、部分内部 `name` 属性规格提示，以及 `Alpha` volume 不存在的可视化提示。

## 11. 已知限制与排错

- 如果独立复制 HDA 后提示 `incomplete asset definition`，安装对应的完整 HDA 库，不能只复制外层 `.hip`。
- `Cannot find volume of name "Alpha"` 是内部可视化节点引用了不存在的 layer，不等于 `height` 输出为空；应在 Geometry Spreadsheet 检查实际 layer。
- 输出是 HeightField volume，不要用普通 polygon mesh 的方式判断面数；导入 UE 前应检查 layer、分辨率和材质映射。

## 12. 版本记录

- V1：H21 高程地形、噪声、侵蚀、坡度遮罩和 UE Landscape 参数。
