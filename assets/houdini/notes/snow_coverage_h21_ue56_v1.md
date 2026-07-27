# Snow Coverage H21 / UE5.6 V1

## 1. 资产概览

这是一个岩石表面积雪工具。它根据朝向、坡度、边缘、风向和高度生成厚雪层、边缘结壳、下垂堆积和雪点，可保留原始表面并写入 UE 材质与实例属性。

## 2. 文件与要求

- 场景：[snow_coverage_h21_ue56_v1.hip](snow_coverage_h21_ue56_v1.hip)
- Houdini：`21.0.631`
- 外层网络：`/obj/snow_coverage_h21_ue56_builder`
- HDA 节点：`/obj/snow_coverage_h21_ue56_builder/SNOW_COVERAGE_H21_UE56_V1`
- 输出：`/obj/snow_coverage_h21_ue56_builder/OUT_PREVIEW_SNOW_COVERAGE_HDA`
- 预览：[snow_coverage_h21_ue56_v1_preview.png](../analysis/snow_coverage_h21_ue56_v1_preview.png)
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)

HDA 定义嵌入当前 HIP。用于 UE5.6 Houdini Engine 时，应安装对应 HDA，并确认雪材质和可选雪团 mesh 路径存在。

## 3. 快速使用

1. 打开 HIP，选择 `SNOW_COVERAGE_H21_UE56_V1`。
2. 将真实资产接入输入 0；没有输入时场景使用 `DEMO_SNOW_INPUT_LEDGE_STONES`。
3. 调整 `cover_intensity`、`slope_start`、`edge_buildup` 和 `snow_thickness`。
4. 使用 `output_view` 检查完整输出、雪层或雪点。

## 4. 主要参数

- `output_view`：输出视图选择。
- `include_source_mesh`：是否保留原始网格，当前开启。
- `use_demo_when_empty`：无输入时使用 demo，当前开启。
- `seed`：随机种子，当前为 `37`。
- `cover_intensity`、`cover_threshold`：覆盖量和阈值。
- `slope_start`、`slope_softness`、`upward_bias`：坡度起始、过渡和朝上偏置。
- `edge_buildup`、`side_crust_strength`：边缘堆积和侧面结壳。
- `wind_drift_strength`、`wind_directionx/y/z`：风吹偏移。
- `height_bias`：高度偏置。
- `snow_thickness`、`surface_offset`：雪层厚度和表面偏移。
- `lump_amplitude`、`lump_frequency`、`powder_noise_frequency`：雪面起伏和粉雪噪声。
- `overhang_amount`、`skirt_depth`：下垂和边缘裙边。
- `spawn_point_scale`：雪点 `pscale`。
- `snow_unreal_material`、`snow_clump_instance_path`：UE 雪材质和可选雪团实例。

## 5. 节点逻辑

```text
DEMO_SNOW_INPUT_LEDGE_STONES -> DEMO_COMPUTE_NORMALS
真实输入 0 ------------------/
             -> SNOW_COVERAGE_H21_UE56_V1 -> OUT_PREVIEW_SNOW_COVERAGE_HDA
```

HDA 内部先计算覆盖 mask，再生成雪层、边缘结壳、粉雪扰动和可选点输出。

## 6. 输出

| 输出 | 用途 | 当前第 1 帧统计 |
|---|---|---:|
| `OUT_PREVIEW_SNOW_COVERAGE_HDA` | 原始 mesh、雪层和雪点的统一预览 | 705 points / 458 prims / 1,871 vertices |

当前包围盒约为 `(-3.380, -0.005, -2.992)` 到 `(3.390, 2.211, 2.989)`。

## 7. 属性

- 点属性：`P`、`N`、`Cd`、`Alpha`、`pscale`、`snow_mask`、`snow_thickness`、`unreal_instance`
- 面属性：`name`、`module`、`snow_mask`、`snow_thickness`、`snow_roughness`、`shop_materialpath`、`unreal_material`
- `name` 通常区分雪面、侧面雪层和 `source_mesh`。

## 8. 动画与时间轴

- 场景范围：1-240 帧，24 fps。
- 当前保存帧：1。
- 工具是静态覆盖生成器，不依赖时间轴动画。

## 9. 材质与 UE5.6

- 默认雪材质参数：`/Game/Materials/M_ProceduralSnow.M_ProceduralSnow`
- 可选雪团实例：`snow_clump_instance_path`
- 如果保留底层网格，可打开 `assign_base_material` 并填写 `base_unreal_material`。

## 10. 验证

- HIP 可打开，当前输出可 cook。
- 当前输出没有 node error。
- Houdini 报告 HDA 定义不完整提示；当前 Embedded 场景仍能生成默认 demo 输出。

## 11. 已知限制与排错

- 默认输出来自 demo 几何，不代表真实屋顶或岩石的积雪效果；接入真实网格后要检查法线和坡度方向。
- 雪覆盖太少时检查 `cover_threshold`、`slope_start`、`upward_bias` 和输入法线。
- 雪点只是一组 UE instancing 数据，`snow_clump_instance_path` 不存在时不会产生真实雪团 mesh。
- 独立使用时若提示 `incomplete asset definition`，安装完整 HDA 库并确认 Houdini Engine 版本。

## 12. 版本记录

- V1：H21/UE5.6 厚雪层、结壳、风向、雪点和 UE 属性输出。
