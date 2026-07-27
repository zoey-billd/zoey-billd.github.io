# Moss Coverage H21 / UE5.6 V1

## 1. 资产概览

这是一个岩石表面苔藓覆盖工具。它可以读取输入 mesh，也可以在没有输入时使用内置的 ledge/stone demo。流程根据朝向、裂缝、边缘、阴影和高度生成苔藓薄层、边缘裙边与苔藓点，并写入 UE 材质和实例属性。

## 2. 文件与要求

- 场景：[moss_coverage_h21_ue56_v1.hip](moss_coverage_h21_ue56_v1.hip)
- Houdini：`21.0.631`
- 外层网络：`/obj/moss_coverage_h21_ue56_builder`
- HDA 节点：`/obj/moss_coverage_h21_ue56_builder/MOSS_COVERAGE_H21_UE56_V1`
- 输出：`/obj/moss_coverage_h21_ue56_builder/OUT_PREVIEW_MOSS_COVERAGE_HDA`
- 预览：[moss_coverage_h21_ue56_v1_preview.png](../analysis/moss_coverage_h21_ue56_v1_preview.png)
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)

HDA 定义嵌入当前 HIP。用于 UE5.6 Houdini Engine 时，应额外安装对应 HDA，并确认项目材质路径存在。

## 3. 快速使用

1. 打开 HIP，选择 `MOSS_COVERAGE_H21_UE56_V1`。
2. 真实资产接入输入 0；默认场景会使用 `DEMO_MOSS_INPUT_LEDGE_STONES`。
3. 需要输入资产时将 `use_demo_when_empty` 关闭，或确保输入网格优先级高于 demo。
4. 查看 `OUT_PREVIEW_MOSS_COVERAGE_HDA`，使用 `output_view` 检查覆盖、苔藓层和点输出。

## 4. 主要参数

- `output_view`：输出视图选择。
- `include_source_mesh`：是否保留原始网格，当前开启。
- `use_demo_when_empty`：无输入时使用 demo，当前开启。
- `seed`：随机种子，当前为 `83`。
- `growth_intensity`、`growth_threshold`：苔藓覆盖强度和阈值。
- `top_surface_bias`、`vertical_growth`、`cavity_boost`、`edge_grip`：朝上面、垂直面、裂缝和边缘偏置。
- `low_height_moisture`、`shade_strength`：低处湿度和阴影偏置。
- `patch_noise_frequency`、`micro_noise_frequency`：斑块与微观噪声。
- `moss_thickness`、`fuzz_height`、`surface_offset`、`patch_expansion`：苔藓几何厚度、绒毛高度和表面偏移。
- `moss_point_density`、`max_moss_points`、`moss_point_scale`：实例点数量和大小。
- `moss_unreal_material`、`moss_instance_path`：UE 苔藓材质和可选实例 mesh。
- `assign_base_material`、`base_unreal_material`：是否给保留的底层网格写基础材质。

## 5. 节点逻辑

```text
DEMO_MOSS_INPUT_LEDGE_STONES -> DEMO_COMPUTE_NORMALS
真实输入 0 ------------------/
             -> MOSS_COVERAGE_H21_UE56_V1 -> OUT_PREVIEW_MOSS_COVERAGE_HDA
```

苔藓 HDA 内部根据输入法线、裂缝/边缘和高度计算 coverage mask，再生成苔藓 carpet、edge skirt 和 point instancing 数据。

## 6. 输出

| 输出 | 用途 | 当前第 1 帧统计 |
|---|---|---:|
| `OUT_PREVIEW_MOSS_COVERAGE_HDA` | 原始 mesh、苔藓层和点属性的统一预览 | 3,243 points / 806 prims / 3,276 vertices |

当前包围盒约为 `(-3.341, -0.005, -2.969)` 到 `(3.364, 2.064, 2.965)`。

## 7. 属性

- 点属性：`P`、`N`、`up`、`pscale`、`Cd`、`Alpha`、`moss_mask`、`moss_height`、`unreal_instance`
- 面属性：`name`、`module`、`moss_mask`、`moss_height`、`moss_roughness`、`shop_materialpath`、`unreal_material`
- `name` 通常区分 `source_mesh`、`moss_carpet` 和 `moss_edge_skirt`。

## 8. 动画与时间轴

- 场景范围：1-240 帧，24 fps。
- 当前保存帧：1。
- 工具是静态覆盖生成器，不依赖时间轴动画。

## 9. 材质与 UE5.6

- 默认苔藓材质参数：`/Game/Materials/M_ProceduralMoss.M_ProceduralMoss`
- 可选实例 mesh：`moss_instance_path`
- 如果保留底层网格，可用 `base_unreal_material` 写入基础材质。

## 10. 验证

- HIP 可打开，当前输出可 cook。
- 当前输出没有 node error。
- Houdini 报告 HDA 定义不完整提示；当前 Embedded 场景仍能生成默认 demo 输出。

## 11. 已知限制与排错

- 默认看到的是 demo ledge stones，不是用户的实际资产；接入输入 0 后应重新检查法线方向和 coverage。
- 如果没有苔藓点，检查 `moss_point_density`、`max_moss_points`、coverage 阈值和 `moss_instance_path`。
- `moss_unreal_material` 是 UE 项目路径，路径不存在时 Houdini 几何仍可能正常，但 UE 材质不会自动解析。
- 独立使用时若提示 `incomplete asset definition`，安装完整 HDA 库并确认 Houdini Engine 版本。

## 12. 版本记录

- V1：H21/UE5.6 苔藓覆盖、边缘裙边、属性输出和实例点。
