# Tree Labs Branch Gnarly Trunk V5

## 1. 资产概览

这是一个以 Gnarly 主干为重点的程序化树生成场景。它先生成有结节、纵向沟槽和不规则轮廓的树干，再生成可见分枝、封闭枝条 mesh、连接叶片点和程序化 maple 叶片，最后输出完整树体。

## 2. 文件与要求

- 场景：[tree_labs_branch_mianbao_trunk_v5.hip](tree_labs_branch_mianbao_trunk_v5.hip)
- Houdini：`21.0.631`
- 主 HDA：`/obj/TREE_LABS_BRANCH_GNARLY_TRUNK_V5`
- HDA 类型：`billd::tree_labs_branch_gnarly_trunk::5.0`
- 输出：`/obj/TREE_LABS_BRANCH_GNARLY_TRUNK_V5/OUT_LABS_BRANCH_GNARLY_TRUNK_V5`
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)
- 旧版验证记录：[tree_labs_branch_gnarly_trunk_v5_report.json](../analysis/tree_labs_branch_gnarly_trunk_v5_report.json)

HDA 定义保存在 HIP 的 Embedded 区域。当前默认关闭时间轴驱动，打开文件后第 1 帧即可看到完整树形。

## 3. 快速使用

1. 选择 `/obj/TREE_LABS_BRANCH_GNARLY_TRUNK_V5`。
2. 先调整 `trunk_surface_radius`、`trunk_surface_roughness`、`trunk_surface_wander`、`trunk_surface_lobe_strength` 和 `trunk_surface_groove_depth`。
3. 再调整 `labs_visible_branch_count`、`labs_branch_spread`、`leaf_density_control` 和 `leaf_count`。
4. 查看 `OUT_LABS_BRANCH_GNARLY_TRUNK_V5`。

## 4. 主要参数

### Gnarly 树干

- `trunk_surface_enable`：当前开启 Gnarly 主干表面。
- `trunk_surface_radius`：当前 `0.72`。
- `trunk_surface_roughness`：当前 `1.35`。
- `trunk_surface_wander`：主干中心线摆动。
- `trunk_surface_lobe_strength`：大块鼓包强度。
- `trunk_surface_groove_depth`：纵向沟槽深度。
- `trunk_surface_knot_count`：结节数量，当前 `28`。
- `trunk_surface_sides`、`trunk_surface_rings`：树干截面和纵向分辨率。

### 枝条与叶片

- `trunk_height`、`trunk_radius`、`radius_scale`：基础树干和枝条尺寸。
- `branch_lift`、`branch_prune`、`distort_amount`：枝条形态。
- `labs_visible_branch_count`、`upper_branch_boost`、`labs_branch_spread`、`labs_upper_branch_height`：分枝布局。
- `leaf_density`、`leaf_density_control`、`leaf_count`、`leaf_scale`：叶量和大小。
- `leaf_attach_branch_radius`、`leaf_attach_padding`、`leaf_attach_min_offset`：叶柄与枝条连接偏移。

### 生长

- `growth_progress`：手动进度。
- `animate_growth`：当前关闭。
- `growth_start_frame`、`growth_end_frame`：动画范围，当前为 1-120。
- `branch_growth_delay`、`leaf_growth_delay`：枝条和叶片延迟。

## 5. 节点逻辑

```text
PY_GNARLY_TRUNK_SURFACE_V5 -> CTRL_GNARLY_TRUNK_SURFACE_GROWTH_V5
PY_LABS_VISIBLE_BRANCH_CURVES_V2 -> CTRL_LABS_VISIBLE_BRANCH_GROWTH_V2
  -> BUILD_LABS_VISIBLE_BRANCH_MESH_V2 -> CAP_LABS_VISIBLE_BRANCH_MESH_V2
  -> BUILD_LABS_MID_BRANCH_LEAF_POINTS_V2 -> CTRL_LABS_MID_BRANCH_LEAF_TIMING_V2
LEAF_SOURCE_PROCEDURAL_CONNECTED_MAPLE -> COPY_LABS_MID_BRANCH_LEAVES_V2
  -> MERGE_OUT_LABS_BRANCH_GNARLY_TRUNK_V5 -> OUT_LABS_BRANCH_GNARLY_TRUNK_V5
```

Python 节点生成树干、枝条和叶片源；VEX 控制生长和点筛选；Polywire/Polycap 将曲线变成封闭枝条；Copy to Points 复制连接叶片。

## 6. 输出

| 输出 | 用途 | 当前第 1 帧统计 |
|---|---|---:|
| `OUT_LABS_BRANCH_GNARLY_TRUNK_V5` | 完整树干、枝条和叶片 | 8,224 points / 5,465 prims / 23,140 vertices |

当前包围盒约为 `(-3.090, 0, -2.771)` 到 `(3.116, 8.140, 2.326)`。

## 7. 属性

- 点属性：`P`、`Cd`、`pscale`、`up`、`path_u`、`branch_level`
- 面属性：`tree_part`
- `tree_part` 用于区分树干、branch、twig、leaf stem 和 leaf blade。

## 8. 动画与时间轴

- 场景范围：1-120 帧，24 fps。
- 当前保存帧：1。
- `animate_growth=0`，所以第 1 帧已经显示完整树形。
- 打开动画后，`growth_start_frame=1`、`growth_end_frame=120` 控制生长过程。

## 9. 材质与视口

当前场景没有独立材质网络，颜色主要来自 `Cd`，适合在 Houdini 视口检查树干和叶片分区。后续 UE 导出可根据 `tree_part` 写材质或输出名。

## 10. 验证

- HIP 可打开，当前输出可 cook。
- 当前扫描没有 node error。
- merge 节点有 1 条属性集合不一致警告，来自树干、枝条和叶片分支属性不同。

## 11. 已知限制与排错

- 如果想在第 1 帧看到生长初态，需要打开 `animate_growth`，并把当前帧移到 `growth_start_frame` 附近。
- 如果树干过于平滑，提高 `trunk_surface_roughness`、`trunk_surface_lobe_strength` 或 `trunk_surface_groove_depth`；提高 `trunk_surface_sides/rings` 会增加计算量。
- merge 警告不代表输出为空；要严格消除它，需要在合并前统一不同分支的点属性。

## 12. 版本记录

- V5：Gnarly 主干、分枝、连接叶片、生长参数和 Labs 风格输出。
