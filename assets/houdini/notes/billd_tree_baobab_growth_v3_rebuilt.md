# Baobab Growth V3 Rebuilt

## 1. 资产概览

这是一个程序化猴面包树场景，包含瓶状树干、主枝、次枝、程序化叶片和按时间轴生长的控制逻辑。场景还保留了原始预览输出，并增加了一个独立的可见性/材质预览分支，用于避免视口过暗。

## 2. 文件与要求

- 场景：[billd_tree_baobab_growth_v3_rebuilt.hip](billd_tree_baobab_growth_v3_rebuilt.hip)
- Houdini：`21.0.631`
- 主网络：`/obj/billd_tree_baobab_growth_v3_rebuilt`
- 原始输出：`/obj/billd_tree_baobab_growth_v3_rebuilt/OUT_BAOBAB_TREE_PREVIEW`
- 默认可见输出：`/obj/billd_tree_baobab_growth_v3_rebuilt/OUT_BAOBAB_TREE_VISIBLE`
- 预览图：[baobab_growth_v3_visible_opengl.png](../analysis/baobab_growth_v3_visible_opengl.png)
- 验证扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)

当前 HIP 内含 `MAT_baobab_warm_viewport` 和预览相机/灯光。独立复制节点时需要一起保留这些对象。

## 3. 快速使用

1. 打开 HIP，进入 `/obj/billd_tree_baobab_growth_v3_rebuilt`。
2. 查看 `OUT_BAOBAB_TREE_VISIBLE`，它是当前默认 display/render 输出。
3. 在第 1 帧到第 120 帧之间拖动时间轴观察生长；当前保存帧为 120。
4. 需要检查原始逻辑时，查看 `OUT_BAOBAB_TREE_PREVIEW`，不要删除 `MERGE_OUT_BAOBAB_TREE_PREVIEW`。

## 4. 主要控制参数

### 树干与枝条

- `trunk_height`、`trunk_radius`：基础瓶状树干尺寸。
- `solid_trunk_radius`、`radius_scale`：树干实体厚度与枝条半径。
- `branch_lift`、`branch_prune`、`distort_amount`：枝条抬升、裁剪和形态扰动。
- `labs_visible_branch_count`、`upper_branch_boost`、`labs_branch_spread`、`labs_upper_branch_height`：主枝数量、上冠层补枝、展开范围和高度。
- `seed`：随机种子。

### 生长与叶片

- `growth_progress`：手动生长进度。
- `animate_growth`、`growth_start_frame`、`growth_end_frame`：是否由时间轴驱动以及生长帧段。
- `branch_growth_delay`、`leaf_growth_delay`：枝条和叶片出现的延迟。
- `leaf_density`、`leaf_density_control`、`leaf_count`：叶片密度、控制系数和最大叶片数。
- `leaf_scale`、`leaf_growth_softness`、`mid_branch_leaf_bias`：叶片尺寸、出生随机柔化和中段偏置。
- `leaf_source_stem_length`、`leaf_source_blade_length`：程序化叶片源模型尺寸。

### Baobab 形态

- `baobab_trunk_height`、`baobab_trunk_belly`、`baobab_neck_radius`：猴面包树树干比例。
- `baobab_bark_roughness`：树皮扰动。
- `baobab_branch_spread`、`baobab_primary_branches`、`baobab_twig_density`：树冠展开、主枝数量和细枝密度。

## 5. 节点逻辑

```text
PY_BAOBAB_BOTTLE_TRUNK
  -> CTRL_BAOBAB_TRUNK_GROWTH -> CAP_BAOBAB_BOTTLE_TRUNK
PY_BAOBAB_BRANCH_CURVES
  -> CTRL_BAOBAB_BRANCH_GROWTH -> BUILD_BAOBAB_BRANCH_MESH -> CAP_BAOBAB_BRANCH_MESH
  -> BUILD_BAOBAB_LEAF_POINTS -> CTRL_BAOBAB_LEAF_TIMING
LEAF_SOURCE_PROCEDURAL_CONNECTED_MAPLE -> COPY_BAOBAB_LEAVES
两条几何分支 -> MERGE_OUT_BAOBAB_TREE_PREVIEW -> OUT_BAOBAB_TREE_PREVIEW
OUT_BAOBAB_TREE_PREVIEW -> VIS_BAOBAB_BRIGHT_VIEWPORT -> OUT_BAOBAB_TREE_VISIBLE
```

`PY_*` 节点负责程序化生成；`CTRL_*` 节点用 VEX 根据生长进度裁剪；`POLYWIRE/POLYCAP` 负责枝条实体化和封口；`COPY_BAOBAB_LEAVES` 将叶片源复制到带有 `pscale/orient` 信息的点上。

## 6. 输出

| 输出 | 用途 | 当前帧统计 |
|---|---|---:|
| `OUT_BAOBAB_TREE_PREVIEW` | 原始忠实预览输出 | 12,234 points / 10,496 prims / 44,088 vertices |
| `OUT_BAOBAB_TREE_VISIBLE` | 当前默认的明亮材质预览 | 12,234 points / 10,496 prims / 44,088 vertices |

当前输出包围盒约为 `(-4.386, -0.057, -4.534)` 到 `(5.070, 4.472, 4.537)`。

## 7. 属性

- 点属性：`P`、`Cd`、`up`、`pscale`、`path_u`、`branch_level`、`tree_part`
- 面属性：`tree_part`
- `tree_part` 用于区分树干、枝条、细枝和叶片，适合后续分材质或 UE 输出。

## 8. 动画与时间轴

- 场景范围：1-120 帧，24 fps。
- 当前场景保存为第 120 帧。
- `animate_growth` 当前开启，`growth_end_frame` 当前为 10；因此从第 10 帧后已经是完整树形。
- 如果希望完整树形在第 1 帧就显示，可关闭 `animate_growth`；如果希望延长生长过程，可增大 `growth_end_frame`。

## 9. 材质与视口

- 材质：`/mat/MAT_baobab_warm_viewport`
- 预览相机：`/obj/CAM_baobab_visible`
- 目标点：`/obj/LOOKAT_baobab_center`
- 视口环境：`/obj/ENV_soft_viewport`
- OpenGL 输出：`/out/RENDER_baobab_growth_v3_visible`

## 10. 验证

- Houdini 21.0.631 可重新打开该 HIP。
- 当前默认输出可以 cook，未发现 node error。
- 扫描到 1 条属性合并警告：`MERGE_OUT_BAOBAB_TREE_PREVIEW` 的输入属性集合不完全一致。

## 11. 已知限制与排错

- 如果视口黑暗，确认 display 选中 `OUT_BAOBAB_TREE_VISIBLE`，并确认 `/mat/MAT_baobab_warm_viewport` 没有被替换为空材质。
- `OUT_BAOBAB_TREE_VISIBLE` 是显示辅助分支；需要严格复现原始网络时使用 `OUT_BAOBAB_TREE_PREVIEW`。
- 合并警告来自不同分支属性集合不完全相同，当前几何仍可生成；若要消除警告，应在合并前统一 `up/pscale/branch_level/tree_part` 等属性。

## 12. 版本记录

- V3 rebuilt：复刻树干、枝条、叶片和生长节点逻辑。
- Visibility pass：保留原输出，增加暖棕材质、可见输出、相机和灯光。
