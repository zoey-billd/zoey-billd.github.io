# Medieval Fantasy Town Generator V1

## 1. 资产概览

这是一个中世纪奇幻城镇程序化生成场景。它从台地山体开始，生成半木结构房屋、屋顶、城墙与塔楼、山顶大教堂、暗色植被和 UE 模块实例点，最后合并成一个 Houdini 预览输出。

## 2. 文件与要求

- 场景：[medieval_fantasy_town_generator_v1.hip](medieval_fantasy_town_generator_v1.hip)
- Houdini：`21.0.631`
- 主 HDA：`/obj/MEDIEVAL_FANTASY_TOWN_GENERATOR_V1`
- HDA 类型：`billd::medieval_fantasy_town_generator::1.0`
- 详细扫描：[final_hip_inspection.json](../analysis/final_hip_inspection.json)
- 相关预览：[medieval_fantasy_town_generator_v1_preview.png](../analysis/medieval_fantasy_town_generator_v1_preview.png)

HDA 定义保存在 HIP 的 Embedded 区域。UE 模块和材质路径是参数中的项目路径，外部 UE 工程需要存在对应资源。

## 3. 快速使用

1. 打开 HIP，选择 `/obj/MEDIEVAL_FANTASY_TOWN_GENERATOR_V1`。
2. 先调整 `seed`、`town_radius`、`house_count`、`wall_radius` 和 `cathedral_scale`。
3. 在 Houdini 中查看 `OUT_UNREAL_COMBINED`。
4. 进入 UE/Houdini Engine 时，用 `OUT_MODULE_INSTANCE_POINTS` 检查模块实例属性和资源路径。

## 4. 主要参数

### 城镇布局

- `seed`：当前为 `18`。
- `town_radius`、`hill_height`、`terrace_count`：城镇范围、山体高度和台地层数。
- `street_width`：道路间距提示。
- `house_count`、`house_scale`、`tree_count`：房屋、房屋比例和植被数量。

### 城墙与建筑

- `wall_radius`、`wall_height`、`wall_tower_count`：城墙轮廓、墙高和塔楼数量。
- `roof_pitch`、`timber_density`、`window_density`：屋顶、木构件和窗户细节。
- `cathedral_scale`、`cathedral_spire_height`、`side_spire_count`：主教堂和尖塔层级。

### UE 资源路径

- `house_module_path`、`roof_module_path`、`tower_module_path`、`spire_module_path`、`tree_module_path`：实例化模块。
- `stone_unreal_material`、`plaster_unreal_material`、`timber_unreal_material`、`roof_unreal_material`、`glass_unreal_material`、`foliage_unreal_material`、`terrain_unreal_material`：UE 材质路径。

## 5. 节点逻辑

```text
PY_TERRACED_HILL_AND_BASE
PY_HALF_TIMBER_HOUSES_AND_ROOFS
PY_HERO_CATHEDRAL_AND_SPIRES
PY_CITY_WALLS_AND_TOWERS
PY_DARK_FANTASY_FOLIAGE
PY_UE_MODULE_INSTANCE_POINTS
PY_DEBUG_STREET_CURVES
  -> MERGE_UNREAL_COMBINED_MESH -> OUT_UNREAL_COMBINED
```

各个 `PY_*` 节点独立生成一个功能层；`OUT_*` 节点保留分层结果，便于调试和单独导出。

## 6. 输出

| 输出 | 用途 | 当前保存帧统计 |
|---|---|---:|
| `OUT_UNREAL_COMBINED` | 城镇完整 Houdini mesh 输出 | 48,513 points / 14,377 prims / 55,064 vertices |
| `OUT_TERRAIN_HILL` | 台地山体与底座 | 2,616 points / 654 prims |
| `OUT_HOUSE_MESH` | 房屋、屋顶和木构件 | 42,636 points / 10,724 prims |
| `OUT_CATHEDRAL_CITADEL` | 大教堂、主尖塔和支撑结构 | 832 points / 386 prims |
| `OUT_WALLS_TOWERS` | 城墙和塔楼 | 1,064 points / 728 prims |
| `OUT_FOLIAGE_MESH` | 植被占位 mesh | 1,365 points / 1,885 prims |
| `OUT_MODULE_INSTANCE_POINTS` | UE 模块实例点 | 346 points / 0 prims |
| `OUT_DEBUG_STREET_CURVES` | 道路调试曲线 | 280 points / 11 prims |

## 7. 属性

`OUT_UNREAL_COMBINED` 包含点属性 `P`、`Cd`；面属性 `name`、`module`、`building_id`、`floor_id`、`unreal_material`、`shop_materialpath` 和 `unreal_output_name`。面组包括 `CITADEL`、`FOLIAGE`、`HOUSES`、`TERRAIN`、`WALLS`。

## 8. 动画与时间轴

- 场景范围：1-240 帧，24 fps。
- 当前保存帧：150。
- 当前是静态程序化布局；修改 seed 或数量参数后重新 cook 即可生成新布局。

## 9. 材质与视口

场景没有独立 `/mat` 材质网络，材质通过面属性和 UE 路径参数传递。Houdini 视口可直接查看占位 mesh；UE 中应将 `module` 和 `unreal_material` 属性接入实际资产流程。

## 10. 验证

- HIP 可由 Houdini 21.0.631 打开。
- `OUT_UNREAL_COMBINED` 当前可 cook，未发现错误或警告。
- 当前扫描未发现本地外部文件引用；UE 路径属于项目资源依赖。

## 11. 已知限制与排错

- 当前输出以程序化占位几何为主，不等同于完整 kitbash 资源库。
- UE 模块路径不存在时，输出仍有几何，但 Houdini Engine 无法实例化真实模块。
- 需要更大城镇时，优先降低 `preview_lowres` 或降低细节密度，再提高 `house_count`、`tree_count` 和 `wall_tower_count`。

## 12. 版本记录

- V1：台地、房屋、教堂、城墙、植被、UE 模块点和道路调试曲线。
