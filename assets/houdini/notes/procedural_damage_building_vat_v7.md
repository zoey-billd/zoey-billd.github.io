# Procedural Damage Building VAT V7

## 1. 资产概览

这是一个程序化建筑冲击破坏场景。它生成建筑外壳、受击区域、碎裂块、木屑、玻璃碎片、尘点和刚体式 VAT-ready 动画数据，同时保留静态建筑代理、rest fracture mesh、debug mask、速度向量和 UE debris instance points。

## 2. 文件与要求

- 场景：[procedural_damage_building_vat_v7.hip](procedural_damage_building_vat_v7.hip)
- Houdini：`21.0.631`
- 主 HDA：`/obj/BUILDING_DAMAGE_VAT_V1`
- HDA 类型：`billd::building_damage_vat::1.0`
- VAT ROP：`/out/ROP_building_damage_vat_rigid`
- 预览：[procedural_damage_building_vat_v7_preview.png](../analysis/procedural_damage_building_vat_v7_preview.png)
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)

当前 HIP 使用 Embedded HDA 定义，并包含 Labs Vertex Animation Textures ROP。实际导出前需要确认 UE 工程路径、材质、VAT 输出目录和 Labs 版本。

## 3. 快速使用

1. 打开 HIP，选择 `/obj/BUILDING_DAMAGE_VAT_V1`。
2. 用 `DebugView` 切换完整破坏、impact mask、速度向量、裂缝曲线或 debris points。
3. 在第 1-96 帧检查动画，重点查看 `damage_start_frame` 到 `damage_end_frame`。
4. VAT 烘焙时将 `OUT_VAT_BAKE_MESH` 作为 ROP 的输入几何。

## 4. 主要参数

### 建筑形体

- `seed`：当前为 `37`。
- `building_width`、`building_depth`、`floors`、`bay_count`：建筑尺寸和开间数量。
- `floor_height`、`wall_thickness`、`roof_height`、`arch_height`：楼层、墙体、屋顶和拱券。

### 受击与破坏

- `impact_centerx/y/z`、`impact_radius`：受击中心和范围。
- `hole_openness`：破洞开放程度。
- `blast_directionx/y/z`、`blast_strength`：爆炸方向和强度。
- `gravity`、`air_drag`：碎片下落和阻力。
- `debris_amount`、`wall_chunk_count`、`wood_splinter_count`、`glass_shard_count`、`dust_point_count`：碎片预算。
- `damage_start_frame`、`damage_end_frame`：当前为 10-72 帧。
- `eval_frame`：当前保存为第 48 帧。

### UE 资源

`ue_wall_material`、`ue_core_material`、`ue_roof_material`、`ue_wood_material`、`ue_glass_material`、`ue_dust_material`、`ue_floor_material` 和 `ue_debris_instance_asset` 负责写入 UE 项目资源路径。

## 5. 节点逻辑

```text
PY_STATIC_BUILDING_PROXY
PY_REST_FRACTURE_MESH
PY_FINAL_ANIMATED_DAMAGE_MESH
PY_DEBUG_IMPACT_MASK
PY_DEBUG_VELOCITY_VECTORS
PY_DEBUG_CRACK_CURVES
PY_VAT_PIVOT_POINTS
PY_UE_DEBRIS_INSTANCE_POINTS
  -> OUT_* 分层输出
  -> SWITCH_DEBUG_VIEW -> OUT_BUILDING_DAMAGE_VIEW
```

Python 节点负责按参数生成稳定的建筑和破坏几何；输出节点用命名约定固定数据接口，便于 VAT、调试和 UE 实例化。

## 6. 输出

| 输出 | 用途 | 当前保存帧统计 |
|---|---|---:|
| `OUT_BUILDING_DAMAGE_VIEW` | 当前 debug view 默认输出 | 2,915 points / 2,050 prims / 8,118 vertices |
| `OUT_FINAL_ANIMATED_MESH` | 当前帧破坏动画网格 | 2,915 points / 2,050 prims |
| `OUT_VAT_BAKE_MESH` | VAT ROP 主输入 | 2,915 points / 2,050 prims |
| `OUT_REST_FRACTURE_MESH` | 静态 rest 碎裂网格 | 2,870 points / 2,050 prims |
| `OUT_STATIC_BUILDING_PROXY` | 未破坏建筑代理 | 968 points / 726 prims |
| `OUT_VAT_PIVOT_POINTS` | 每个 piece 的 VAT pivot | 410 points |
| `OUT_UE_DEBRIS_INSTANCE_POINTS` | UE 碎片实例点 | 289 points |
| `OUT_DEBUG_IMPACT_MASK` / `OUT_DEBUG_VELOCITY_VECTORS` / `OUT_DEBUG_CRACK_CURVES` | 受击、速度和裂缝调试 | 调试用途 |

当前包围盒约为 `(-7.500, -0.306, -7.212)` 到 `(7.500, 6.126, 4.200)`。

## 7. 属性

主要点属性：`P`、`P_rest`、`v`、`w`、`piece_id`、`vat_piece_id`、`vat_pivot`、`dynamic`、`fracture_zone`、`impact_mask`、`unreal_instance`、`unreal_material`、`pscale`、`Cd`、`Alpha`。

主要面属性：`piece_id`、`vat_piece_id`、`dynamic`、`fracture_zone`、`impact_mask`、`module`、`name`、`shop_materialpath` 和 `unreal_material`。面组包括 `vat_dynamic`、`vat_static`、`damage_core`、`damage_middle`、`damage_shell` 及材质组。

## 8. 动画与时间轴

- 场景范围：1-96 帧，24 fps。
- 当前保存帧：48。
- 破坏主要发生在第 10-72 帧。
- VAT 烘焙必须使用固定的帧范围和稳定的 `piece_id/vat_piece_id`。

## 9. 材质与 VAT

场景包含 `/mat/damage_wall`、`damage_fresh_core`、`damage_roof`、`damage_wood`、`damage_glass`、`damage_dust` 和 `damage_stone_floor`。ROP 为 `labs::vertex_animation_textures::3.0`，模式为刚体 VAT 方向；导出前应在 ROP 中检查目标平台和输出目录。

## 10. 验证

- HIP 可打开，当前 debug 输出可 cook。
- 当前扫描没有 node error 或 warning。
- 当前默认输出的属性和面组完整，适合继续做 VAT 或 UE instance 验证。

## 11. 已知限制与排错

- 这是程序化破坏/VAT-ready 生成器，不是完整 Bullet DOP 缓存；需要真实物理结果时，应替换或扩展 `PY_FINAL_ANIMATED_DAMAGE_MESH`。
- VAT 导出成功还依赖 Labs 节点版本、纹理输出目录、UE 材质和导入设置。
- 如果 UE 碎片不出现，先检查 `OUT_UE_DEBRIS_INSTANCE_POINTS` 的 `unreal_instance` 和项目资源路径。
- 如果碎片在动画中跳变，检查 `piece_id`、`vat_piece_id`、pivot 和 rest pose 是否跨帧稳定。

## 12. 版本记录

- V7：建筑破坏预览、VAT 输入、pivot、碎片实例点和 UE 材质属性。
