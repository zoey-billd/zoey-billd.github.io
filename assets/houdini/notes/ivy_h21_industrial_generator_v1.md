# Ivy H21 Industrial Generator V1

## 1. 资产概览

这是一个工业建筑表面藤蔓生成器。它可以读取建筑表面作为输入；没有有效输入时使用内置测试墙面。流程生成藤蔓曲线、闭合藤蔓网格、叶片点和可选叶片预览，并为 UE/Houdini Engine 写入 `unreal_*` 属性。

## 2. 文件与要求

- 场景：[ivy_h21_industrial_generator_v1.hip](ivy_h21_industrial_generator_v1.hip)
- Houdini：`21.0.631`
- 主 HDA：`/obj/IVY_H21_INDUSTRIAL_GENERATOR_V1`
- HDA 类型：`billd::ivy_generator_h21_industrial::1.0`
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)
- 相关旧版说明：[ivy_h21_industrial_generator_v1_cn.md](../analysis/ivy_h21_industrial_generator_v1_cn.md)

当前场景使用 Embedded HDA 定义。当前两个 `object_merge` 输入路径为空，所以默认结果来自内置 fallback surface，而不是外部建筑文件。

## 3. 快速使用

1. 选择 `/obj/IVY_H21_INDUSTRIAL_GENERATOR_V1`。
2. 如果使用真实建筑，给 `IN_BUILDING_SURFACE` 设置对象路径；可选叶片模型设置到 `IN_LEAF_MESH_OPTIONAL`。
3. 调整 `density`、`base_width`、`vine_point_budget` 和 `leaf_point_budget`。
4. 主要查看 `OUT_UNREAL_COMBINED`；需要分层调试时查看曲线、网格或叶片点输出。

## 4. 主要参数

- `seed`：随机种子，当前为 `1`。
- `density`：藤蔓覆盖密度，当前为 `0.5`。
- `base_width`：藤蔓根部宽度。
- `leaf_size`、`leaf_scale_var`：叶片尺寸和随机变化。
- `preview_lowres`：当前开启低分辨率预览。
- `vine_point_budget`、`leaf_point_budget`：曲线采样和叶片点预算。
- `lod_resample_multiplier`、`polyreduce_keep`：LOD 重采样和网格保留比例。
- `prefer_vertical_surfaces`、`climb_bias`：偏好垂直墙面和向上攀爬倾向。
- `branch_chance`、`tendril_density`：分枝和卷须密度。
- `surface_width`、`surface_height`、`surface_roughness`、`adhesion_offset`：无输入时 fallback 墙面和吸附设置。
- `leaf_mesh_path`、`vine_unreal_material`、`leaf_unreal_material`：UE Static Mesh 和材质路径。

## 5. 节点逻辑

```text
IN_BUILDING_SURFACE + IN_LEAF_MESH_OPTIONAL
  -> PY_SURFACE_MASK_INPUT_OR_FALLBACK
  -> PY_VINE_CURVES_V8_STYLE
  -> PY_VINE_MESH_CLOSED
  -> PY_LEAF_POINTS_UE_INSTANCING
  -> PY_PROCEDURAL_LEAF_CARD_FALLBACK
  -> SWITCH_LEAF_MODEL_INPUT_OR_CARD
  -> COPY_REPLACEABLE_LEAF_TO_POINTS

调试分支：PY_DEBUG_CONNECTIONS -> OUT_DEBUG_CONNECTIONS
主分支：OUT_VINES_MESH + OUT_LEAF_POINTS/OUT_LEAF_MESH_PREVIEW
  -> MERGE_VIEWPORT_PREVIEW -> OUT_PREVIEW_MESH
  -> MERGE_UNREAL_OUTPUT -> OUT_UNREAL_COMBINED
```

## 6. 输出

| 输出 | 用途 | 当前保存帧统计 |
|---|---|---:|
| `OUT_UNREAL_COMBINED` | UE 主输出，包含藤蔓网格和叶片属性 | 5,188 points / 4,630 prims / 19,068 vertices |
| `OUT_PREVIEW_MESH` | Houdini 视口完整预览 | 5,188 points / 4,640 prims / 19,078 vertices |
| `OUT_VINES_MESH` | 闭合藤蔓网格 | 5,178 points / 4,630 prims |
| `OUT_VINE_CURVES` | 带路径属性的藤蔓曲线 | 863 points / 137 prims |
| `OUT_LEAF_POINTS` | UE 叶片 instancing 点 | 10 points / 0 prims |
| `OUT_LEAF_MESH_PREVIEW` | 叶片卡片预览 | 10 points / 10 prims |
| `OUT_DEBUG_MASK`、`OUT_DEBUG_CONNECTIONS` | 表面遮罩和连接调试 | 调试用途 |

## 7. 属性

`OUT_UNREAL_COMBINED` 的点属性包括 `P`、`N`、`up`、`orient`、`pscale`、`Cd`、`uv`、`ivy_id`、`leaf_id`、`unreal_instance`、`unreal_material`、`unreal_output_name` 和 `ue_output`。面属性包括 `name`、`unreal_material`、`unreal_output_name` 和 `ue_output`。

## 8. 动画与时间轴

- 场景范围：1-240 帧，24 fps。
- 当前保存帧：226。
- 当前生成逻辑是参数化静态生成，没有专门的生长时间轴；修改参数后重新 cook。

## 9. 材质与 UE

当前场景没有独立 `/mat` 材质网络，材质通过参数和属性写入。将 `leaf_mesh_path`、`vine_unreal_material` 和 `leaf_unreal_material` 填为真实 UE 资源路径后，Houdini Engine 才能实例化目标资源。

## 10. 验证

- HIP 可打开，当前输出可 cook。
- 没有 node error。
- 两个 merge 节点各有 1 条属性集合不一致警告；它们来自网格、曲线和 instancing 点的属性集合不同。

## 11. 已知限制与排错

- 当前输入路径为空时是 fallback 预览，不代表真实建筑表面贴附结果；接入建筑后应重新检查 `OUT_VINE_CURVES` 和 `OUT_VINES_MESH` 的包围盒。
- `OUT_LEAF_POINTS` 默认数量很少，因为当前 fallback 预算和密度设置偏保守；提高 `leaf_point_budget`、`density` 或接入真实叶片模型。
- UE 资源路径只是字符串属性，路径不存在时 Houdini 仍可能有几何，但 UE 实例不会解析成功。

## 12. 版本记录

- V1：H21 工业藤蔓生成器，保留低分辨率预览、闭合网格、叶片 instancing 和调试输出。
