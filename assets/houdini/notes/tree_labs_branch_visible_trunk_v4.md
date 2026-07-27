# Tree Labs Branch Visible Trunk V4

## 1. 资产概览

这是一个以“可见树干实体”为重点的程序化树场景。主干由闭合的 rugged shell 生成，枝条由曲线转为 mesh，叶片通过程序化 connected maple 源模型复制到枝条中段，输出适合视口预览和后续 UE 处理。

## 2. 文件与要求

- 场景：[tree_labs_branch_visible_trunk_v4.hip](tree_labs_branch_visible_trunk_v4.hip)
- Houdini：`21.0.631`
- 主 HDA：`/obj/TREE_LABS_BRANCH_VISIBLE_TRUNK_V4`
- HDA 类型：`billd::tree_labs_branch_visible_trunk::4.0`
- 输出：`/obj/TREE_LABS_BRANCH_VISIBLE_TRUNK_V4/OUT_LABS_BRANCH_VISIBLE_TRUNK_V4`
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)
- 旧版验证记录：[tree_labs_branch_visible_trunk_v4_report.json](../analysis/tree_labs_branch_visible_trunk_v4_report.json)

当前默认关闭时间轴驱动；第 1 帧到第 120 帧均在静态模式下保持完整树形，除非手动打开 `animate_growth`。

## 3. 快速使用

1. 选择 `/obj/TREE_LABS_BRANCH_VISIBLE_TRUNK_V4`。
2. 调整 `trunk_surface_radius`、`trunk_surface_roughness`、`trunk_surface_sides` 和 `trunk_surface_rings`。
3. 调整 `labs_visible_branch_count`、`labs_upper_branch_height`、`leaf_density_control` 和 `leaf_count`。
4. 查看 `OUT_LABS_BRANCH_VISIBLE_TRUNK_V4`。

## 4. 主要参数

### 可见树干

- `trunk_surface_enable`：当前开启。
- `trunk_surface_radius`：当前 `0.532`。
- `trunk_surface_roughness`：当前 `0.453`。
- `trunk_surface_sides`、`trunk_surface_rings`：当前为 `21/31`，控制 shell 分辨率。
- `trunk_height`、`trunk_radius`、`solid_trunk_radius`：树干总体尺寸。

### 枝条与叶片

- `radius_scale`、`branch_lift`、`branch_prune`、`distort_amount`：枝条粗细、抬升、裁剪和扰动。
- `labs_visible_branch_count`、`upper_branch_boost`、`labs_branch_spread`、`labs_upper_branch_height`：主枝和上冠层布局。
- `leaf_density`、`leaf_density_control`、`leaf_count`、`leaf_scale`：叶片数量和尺寸。
- `leaf_growth_delay`、`leaf_growth_softness`、`mid_branch_leaf_bias`：叶片出现时机和分布。

### 生长

- `growth_progress`：手动进度。
- `animate_growth`：当前关闭。
- `growth_start_frame`、`growth_end_frame`：当前为 1-10。

## 5. 节点逻辑

```text
PY_VISIBLE_RUGGED_TRUNK_SURFACE_V4 -> CTRL_VISIBLE_TRUNK_SURFACE_GROWTH_V4
PY_LABS_VISIBLE_BRANCH_CURVES_V2 -> CTRL_LABS_VISIBLE_BRANCH_GROWTH_V2
  -> BUILD_LABS_VISIBLE_BRANCH_MESH_V2 -> CAP_LABS_VISIBLE_BRANCH_MESH_V2
  -> BUILD_LABS_MID_BRANCH_LEAF_POINTS_V2 -> CTRL_LABS_MID_BRANCH_LEAF_TIMING_V2
LEAF_SOURCE_PROCEDURAL_CONNECTED_MAPLE -> COPY_LABS_MID_BRANCH_LEAVES_V2
  -> MERGE_OUT_LABS_BRANCH_VISIBLE_TRUNK_V4 -> OUT_LABS_BRANCH_VISIBLE_TRUNK_V4
```

与 V5 的主要差异是树干生成节点：V4 使用 `PY_VISIBLE_RUGGED_TRUNK_SURFACE_V4` 的可见 shell，重点是让主干成为稳定、可检查的闭合实体。

## 6. 输出

| 输出 | 用途 | 当前保存帧统计 |
|---|---|---:|
| `OUT_LABS_BRANCH_VISIBLE_TRUNK_V4` | 完整可见树干、枝条和叶片 | 8,099 points / 3,394 prims / 16,302 vertices |

当前保存帧为 50，输出包围盒约为 `(-3.380, 0, -3.109)` 到 `(3.432, 7.861, 2.567)`。

## 7. 属性

- 点属性：`P`、`Cd`、`pscale`、`up`、`path_u`、`branch_level`
- 面属性：`tree_part`
- `tree_part` 是后续树干/枝条/叶片分材质和导出的主要依据。

## 8. 动画与时间轴

- 场景范围：1-120 帧，24 fps。
- 当前保存帧：50。
- `animate_growth=0`，因此当前输出为静态完整树形。
- 打开动画后使用 `growth_start_frame=1`、`growth_end_frame=10` 控制快速生长预览。

## 9. 材质与视口

当前场景没有独立材质网络，树干和叶片颜色来自 `Cd`。如果视口看到线框或半透明树干，确认主输出是 `OUT_LABS_BRANCH_VISIBLE_TRUNK_V4`，并使用 Shaded 模式查看。

## 10. 验证

- HIP 可打开，当前输出可 cook。
- 当前扫描没有 node error。
- merge 节点有 1 条属性集合不一致警告，来自树干、枝条和叶片分支属性不同。

## 11. 已知限制与排错

- V4 是可见树干和输出稳定性版本，不是完整真实树皮材质系统。
- `trunk_surface_sides/rings` 太低会出现棱角，太高会增加 cook 成本。
- 如果叶片数量过少，检查 `leaf_density_control`、`leaf_count` 和 `leaf_growth_delay`。
- 若需严格封闭性检查，应在 `CAP_LABS_VISIBLE_BRANCH_MESH_V2` 和最终输出上检查 boundary edges。

## 12. 版本记录

- V4：可见 rugged 树干、分枝、连接叶片和静态默认预览。
