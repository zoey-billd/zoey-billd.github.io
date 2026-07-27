# PCG Spiral Landform Prototype V7 PBR Fog House

## 1. 资产概览

这是一个螺旋地形与奇幻房屋场景。主控制器生成下沉/抬升地形、台地、道路、悬崖层、房屋、树木、岩石和石墙；独立模块节点生成房屋、门、窗、树、干石墙和风化巨石。场景同时包含 PBR 材质、天空、暖光、相机、体积雾和 Karma/USD 输出。

## 2. 文件与要求

- 场景：[youku_pcg_spiral_landform_prototype_v7_pbr_fog_house.hip](youku_pcg_spiral_landform_prototype_v7_pbr_fog_house.hip)
- Houdini：`21.0.631`
- 主控制器：`/obj/PCG_Spiral_Landform_Controller`
- OpenGL fallback：`/out/RENDER_v6_OpenGL_fallback_preview`
- Karma 快速渲染：`/stage/USD_RENDER_v7_Karma_PBR_Fog_quick`
- Karma 2K 渲染：`/stage/USD_RENDER_v7_Karma_PBR_Fog_final_2k`
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)
- 相关设计文档：[pcg_spiral_landform_design_v7_pbr_fog_house_cn.md](../analysis/pcg_spiral_landform_design_v7_pbr_fog_house_cn.md)

当前保存帧为 1，场景没有检测到本地外部文件引用。PBR 材质和 UE/Fab 替换资源仍属于后续项目资源依赖。

## 3. 快速使用

1. 打开 HIP，先选择 `/obj/PCG_Spiral_Landform_Controller`。
2. 调整 `seed`、`scene_radius`、`sink_depth`、`terrace_count`、`spiral_turns` 和 `house_count`。
3. Houdini 视口可查看 `/obj/PCG_Spiral_Landform_Controller/OUT_COMPLETE_PREVIEW`。
4. 需要 PBR/雾效果时进入 `/stage`，优先执行 `USD_RENDER_v7_Karma_PBR_Fog_quick`。
5. 需要最终图时执行 `USD_RENDER_v7_Karma_PBR_Fog_final_2k`，先确认 Karma、材质和输出目录。

## 4. 主要参数

### 螺旋地形

- `reference_preset`、`landform_mode`：参考预设和地形模式。
- `seed`：当前为 `7`。
- `scene_radius`：当前为 `66`。
- `pit_top_radius`、`pit_bottom_radius`、`rim_height`、`sink_depth`：坑体、边缘和深度。
- `terrace_count`、`terrace_drop_scale`：台地数量和落差。
- `spiral_turns`、`spiral_relief`、`vertical_exaggeration`、`spiral_direction`：螺旋形态。
- `cliff_layer_count`、`road_width`、`outer_rock_base`、`underside_drop`：悬崖、道路、外围岩石和底部结构。

### 场景内容

- `house_count`、`house_scale`、`inner_house_clear_radius`：房屋数量、尺寸和中心清空半径。
- `tree_count`、`rock_count`、`wall_density`：树、岩石和石墙密度。
- `white_model_detail`、`cliff_crack_density`、`base_detail_density`、`preview_detail`：几何细节预算。
- `bottom_water`：底部水体开关，当前关闭。

### 独立模块

- `PCG_Stone_House_Module`：`width`、`depth`、`height`、`roof_pitch`。
- `PCG_Door_Module`、`PCG_Window_Module`：宽、高、深度和 frame 厚度。
- `PCG_Round_Tree_Module`：`seed`、`height`、`crown_radius`。
- `PCG_Dry_Stone_Wall_Module`：`length`、`height`、`depth`、`blocks`。
- `PCG_Weathered_Boulder_Module`：`seed`、`scale_x/y/z`。

## 5. 节点逻辑

### Object/SOP

```text
GENERATE_PCG_SPIRAL_LANDFORM_CONTROLLER
  -> OUT_COMPLETE_PREVIEW
  -> POST_KARMA_MATERIAL_TAGS
  -> NORMALS_FOR_KARMA
  -> POST_V7_CINEMATIC_HOUSE_DETAILS
  -> NORMALS_FOR_V7_KARMA
```

独立模块节点各自采用 `GENERATE_*_MODULE -> OUT_COMPLETE_PREVIEW` 的结构。

### Stage/Karma

```text
IMPORT_v7_pbr_geometry
  + KRM_v7_soft_overcast_sky
  + KRM_v7_low_warm_sun
  + CAM_v7_karma_pbr_hero
  + KRM_v7_pit_volume_fog
  + KARMA_v7_pbr_fog_render_settings
  -> KARMA_v7_pbr_fog_stage_render
  -> USD_RENDER_v7_Karma_PBR_Fog_quick / USD_RENDER_v7_Karma_PBR_Fog_final_2k
```

## 6. 输出

| 输出 | 用途 | 当前第 1 帧统计 |
|---|---|---:|
| `/obj/PCG_Spiral_Landform_Controller/OUT_COMPLETE_PREVIEW` | 完整螺旋地形和场景预览 | 247,865 points / 63,552 prims |
| `/obj/PCG_Stone_House_Module/OUT_COMPLETE_PREVIEW` | 石屋模块 | 182 points / 46 prims |
| `/obj/PCG_Door_Module/OUT_COMPLETE_PREVIEW` | 门模块 | 120 points / 30 prims |
| `/obj/PCG_Window_Module/OUT_COMPLETE_PREVIEW` | 窗模块 | 168 points / 42 prims |
| `/obj/PCG_Round_Tree_Module/OUT_COMPLETE_PREVIEW` | 圆冠树模块 | 392 points / 98 prims |
| `/obj/PCG_Dry_Stone_Wall_Module/OUT_COMPLETE_PREVIEW` | 干石墙模块 | 216 points / 54 prims |
| `/obj/PCG_Weathered_Boulder_Module/OUT_COMPLETE_PREVIEW` | 风化巨石模块 | 180 points / 45 prims |

主控制器包围盒约为 `(-70.616, -45.108, -72.667)` 到 `(71.074, 39.667, 71.638)`。

## 7. 属性

主控制器输出点属性为 `P`、`Cd`；面属性为 `source_name`、`shop_materialpath`、`module`、`render_note` 和 `pcg_name`；detail 属性包含 `prototype_note`。独立模块输出主要写入 `module` 面属性。

## 8. 动画与时间轴

- 场景范围：1-240 帧，24 fps。
- 当前保存帧：1。
- 当前为静态 PCG 生成；修改参数后重新 cook。
- Karma 相机、灯光和体积雾位于 `/stage`，不依赖时间轴动画。

## 9. 材质、灯光与渲染

当前 `/mat` 包含：`KRM_meadow_grass`、`KRM_dark_slope_grass`、`KRM_layered_cliff_rock`、`KRM_compacted_gravel_road`、`KRM_limestone_house_stone`、`KRM_warm_roof_tiles`、`KRM_weathered_wood`、`KRM_soft_window_glass`、`KRM_tree_leaf_mass`、`KRM_tree_trunk`、`KRM_dark_pit_water` 和 `KRM_deep_core_shadow`。

`/stage/KRM_v7_soft_overcast_sky`、`KRM_v7_low_warm_sun`、`KRM_v7_pit_volume_fog` 和 `CAM_v7_karma_pbr_hero` 组成 PBR 雾景预览。`/out/RENDER_v6_OpenGL_fallback_preview` 是旧版 OpenGL fallback，不是 v7 Karma 最终输出。

## 10. 验证

- HIP 可由 Houdini 21.0.631 打开。
- 主控制器和所有模块输出均可 cook。
- 当前扫描没有 node error 或 warning。
- Stage 中存在 v7 quick 和 final 2K Karma ROP。

## 11. 已知限制与排错

- `/out` 中保留的是 v6 OpenGL fallback 名称；需要 v7 PBR 雾景时使用 `/stage` 的 Karma ROP。
- `KRM_*` 是当前场景的 PBR 占位材质，Fab/Megascans 纹理替换不随 HIP 自动完成。
- 如果 Karma 画面为空，检查 `IMPORT_v7_pbr_geometry`、Stage camera、render settings 和 output path。
- 主控制器当前有 247k 点，增加 `preview_detail`、`rock_count` 或 `cliff_layer_count` 会明显提高 cook 和渲染成本。

## 12. 版本记录

- V7：螺旋地形、PBR 占位材质、房屋细节、体积雾和 Karma quick/final 输出。
