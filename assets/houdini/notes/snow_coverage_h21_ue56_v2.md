# Snow Coverage H21 / UE5.6 V2

## 1. 资产概览

这是一个面向 Houdini 21 / UE5.6 Houdini Engine 流程的厚积雪覆盖 HDA。它读取输入 mesh，依据面法线朝向、坡度、边缘、风向和高度计算积雪覆盖 Mask，再生成具有体积感的多环积雪几何。

V2 相比 V1 的主要变化是：主积雪厚度提高，并将雪层剖面拆成下层壳体、圆润肩部、顶部雪盖和边缘翻边。`Snow Thickness`、`Base Snow Depth`、`Peak Height`、`Edge Lip Height`、`Shell Depth` 和 `Profile Roundness` 可以分别控制积雪的体积和边缘形态。

该场景同时保留原始输入 mesh，并将雪层写入独立的 `snow_*` 面属性和 UE 材质路径。它是静态积雪生成器，不负责 UE 中人物实时踩踏或动态脚印。

## 2. 文件与要求

- 场景：[snow_coverage_h21_ue56_v2.hip](snow_coverage_h21_ue56_v2.hip)
- Houdini：`21.0.596` 生成并验证；本目录其他文档中的 `21.0.631` 是另一轮检查环境，不应混同
- 外层网络：`/obj/snow_coverage_h21_ue56_builder`
- HDA 节点：`/obj/snow_coverage_h21_ue56_builder/SNOW_COVERAGE_H21_UE56_V2`
- HDA 类型：`billd::snow_coverage_h21_ue56::2.0`
- 主输出节点：`/obj/snow_coverage_h21_ue56_builder/OUT_PREVIEW_SNOW_COVERAGE_HDA`
- 预览图：[snow_coverage_h21_ue56_v2_preview.png](#作品集展示建议)
- 详细验证：[snow_coverage_h21_ue56_v2_verification.json](#验证记录)
- 外部 HDA：使用项目内版本管理的 v2 HDA；公开作品集不暴露本地安装路径。
- UE 工程集成：可将 v2 HDA 安装到 UE5.6 Houdini Engine 可见目录，再创建 Houdini Asset Actor。

HDA 定义曾随当前场景保存为 Embedded 内容。独立打开该 HIP 时，如果 Houdini 优先读取到不完整的 Embedded 定义，可能出现 `incomplete asset definition` 警告；独立 Houdini Engine 或 UE5.6 使用时，应安装上面列出的完整外部 HDA。

## 3. 快速使用

1. 使用 Houdini 21 打开 `snow_coverage_h21_ue56_v2.hip`。
2. 选中 `/obj/snow_coverage_h21_ue56_builder/SNOW_COVERAGE_H21_UE56_V2`。
3. 将真实 mesh 接入输入 0；没有输入时，场景会使用 `DEMO_SNOW_INPUT_LEDGE_STONES` 作为演示几何。
4. 先调整 `Snow Thickness`、`Base Snow Depth` 和 `Peak Height`，再用 `Edge Lip Height`、`Shell Depth` 和 `Profile Roundness` 微调边缘体积。
5. 在 `UE Snow Material` 中填写 UE 项目材质路径，例如 `/Game/Materials/M_Snow.M_Snow`。
6. 使用 `Output View` 查看完整输出、仅雪层、覆盖调试、原始 mesh 或雪点输出。
7. 在 UE5.6 中使用时，将外部 v2 HDA 安装到 Houdini Engine 可见的 HDA 路径，再创建 Houdini Asset Actor。

## 4. 主要参数

### 输入与覆盖

- `output_view`：选择完整 mesh、仅雪层、覆盖调试、原始 mesh 或雪点输出。
- `include_source_mesh`：是否在完整输出中保留原始输入 mesh，当前默认开启。
- `use_demo_when_empty`：输入为空时是否使用演示几何，当前默认开启。
- `seed`：覆盖噪声和雪层起伏的随机种子，当前为 `37`。
- `cover_intensity` / `cover_threshold`：覆盖强度和生成阈值，当前主实例使用 `1.68 / 0.22`。
- `slope_start` / `slope_softness` / `upward_bias`：控制朝上表面的积雪倾向。
- `edge_buildup` / `side_crust_strength`：控制边缘堆积和侧面结壳。
- `wind_drift_strength` / `wind_direction`：控制风向造成的积雪偏移。
- `height_bias`：根据世界高度增加或减少积雪高度。

### 厚度与剖面

- `snow_thickness`：主厚度缩放项，V2 默认值为 `0.28`。
- `base_snow_depth`：覆盖区域的基础雪层厚度，默认 `0.18`。
- `peak_height`：顶部隆起高度，默认 `0.14`。
- `edge_lip_height`：边缘翻边和堆积的额外高度，默认 `0.10`。
- `shell_depth`：雪层边缘向原始表面下方形成的壳体深度，默认 `0.06`。
- `profile_roundness`：肩部从下层壳体过渡到顶部的圆润程度，默认 `0.68`。
- `surface_offset`：雪层与输入表面的基础间隙。
- `lump_amplitude` / `lump_frequency`：大尺度雪堆起伏。
- `powder_noise_frequency`：细颗粒粉雪噪声频率。
- `overhang_amount`：边缘向外翻出的距离。
- `min_patch_area`：过滤过小覆盖面的阈值。
- `spawn_point_scale`：雪点输出的 `pscale` 大小。

### UE 材质与演示

- `snow_unreal_material`：雪层的 `unreal_material` 和 `shop_materialpath`，默认 `/Game/Materials/M_ProceduralSnow.M_ProceduralSnow`。
- `assign_base_material` / `base_unreal_material`：是否给保留的源 mesh 写入基础材质路径。
- `snow_clump_instance_path`：可选雪团 instancing 资源路径。
- `snow_color` / `packed_snow_color`：松软雪和压实雪的顶点颜色。
- `demo_seed` / `demo_scale`：无输入时的演示岩石场景随机种子和尺寸。

## 5. 节点逻辑

```text
DEMO_SNOW_INPUT_LEDGE_STONES -> DEMO_COMPUTE_NORMALS
真实输入 0 ------------------------/
                    -> SNOW_COVERAGE_H21_UE56_V2 -> OUT_PREVIEW_SNOW_COVERAGE_HDA
```

HDA 内部的主要处理顺序为：

```text
IN_SOURCE_MESH_FROM_UE_OR_HOUDINI
  -> CLEAN_TINY_GAPS_FOR_EDGE_MASK
  -> COMPUTE_SOURCE_NORMALS
  -> PY_BUILD_THICK_SNOW_COVERAGE
  -> OUTPUT
```

`PY_BUILD_THICK_SNOW_COVERAGE` 先根据法线、坡度、边缘、风向和高度生成 `snow_mask`，再对每个满足覆盖条件的面生成三组环线：

1. 下层壳体环：保持接近原始表面，并由 `shell_depth` 控制边缘下压。
2. 肩部过渡环：由 `profile_roundness` 控制向顶部雪盖的过渡位置。
3. 顶部雪盖环：由主厚度、基础厚度、隆起高度和边缘翻边共同决定。

侧面由下层环和肩部环、肩部环和顶部环分别生成，因此输出面名会区分 `snow_cover_lower_side` 与 `snow_cover_upper_side`。

## 6. 输出

| 输出 | 用途 | 当前第 1 帧统计 |
|---|---|---:|
| `OUT_PREVIEW_SNOW_COVERAGE_HDA` | 原始 mesh、厚积雪几何和 UE 属性的统一预览 | 970 points / 723 prims / 2,931 vertices |

当前输出包围盒约为 `(-3.380, -0.054, -2.992)` 到 `(3.390, 2.570, 2.989)`。

面名统计如下：

- `source_mesh`：130 prims
- `snow_cover`：63 prims
- `snow_cover_lower_side`：265 prims
- `snow_cover_upper_side`：265 prims

当前材质路径统计如下：

- `/Game/Materials/M_ProceduralSnow.M_ProceduralSnow`：593 prims
- `/Game/Materials/M_Rock_Cold.M_Rock_Cold`：130 prims

## 7. 属性

- 点属性：`P`、`N`、`Cd`、`Alpha`、`pscale`、`snow_mask`、`snow_thickness`、`unreal_instance`
- 面属性：`name`、`module`、`snow_mask`、`snow_thickness`、`snow_roughness`、`shop_materialpath`、`unreal_material`
- `name` 用于区分 `source_mesh`、`snow_cover`、`snow_cover_lower_side` 和 `snow_cover_upper_side`。
- `snow_mask` 可用于 UE 材质中区分积雪覆盖程度。
- `snow_thickness` 可用于 UE 材质中的雪层厚度、颜色或压实效果控制。
- `unreal_material` 和 `shop_materialpath` 保存 UE 项目材质路径；它们不代表材质资源已经被嵌入 HIP。

## 8. 动画与时间轴

- 场景范围：`1-240` 帧，`24 fps`。
- 当前保存帧：`1`。
- 该工具是静态积雪覆盖生成器，不依赖时间轴驱动生长或动画。
- 修改覆盖参数、厚度参数或 `seed` 后重新 cook 即可得到新的雪层。
- 当前版本不包含 UE 人物实时脚印、动态压雪或 Render Target/RVT 脚印更新逻辑。

## 9. 材质与 UE5.6

- 默认雪材质：`/Game/Materials/M_ProceduralSnow.M_ProceduralSnow`
- 默认源 mesh 材质：`/Game/Materials/M_Rock_Cold.M_Rock_Cold`
- UE 使用时可将 `snow_unreal_material` 替换为项目已有雪材质，或替换为其他覆盖类材质。
- 如果保留源 mesh，开启 `assign_base_material` 并填写 `base_unreal_material`，即可同时写入基础材质路径。
- UE5.6 Houdini Engine 使用时，应安装项目内版本管理的 v2 HDA，并按项目规范配置材质路径。
- 该 HDA 输出的是静态几何和属性；人物动态脚印建议在 UE 中使用材质、RVT、Render Target 或蓝图事件另行处理。

## 10. 验证

- 使用 Houdini `21.0.596` 生成并保存 v2 HIP、HDA、预览和 JSON 验证报告。
- `snow_coverage_h21_ue56_v2.hip` 可以加载，当前输出几何可读取，外层网络无 node error。
- 生成脚本中的独立 HDA clean-session 测试通过：`934 points / 696 prims`，无 cook error、无 cook warning。
- 厚度探针通过：clean-session 中较薄设置最高点约为 `2.424`，较厚设置最高点约为 `2.544`，主 `Snow Thickness` 参数能够改变输出高度。
- 当前默认输出验证为 `970 points / 723 prims`，属性和材质路径均存在。
- 直接独立加载该 HIP 时，节点可能报告 `incomplete asset definition`；这是 Embedded 定义与外部 HDA 库未正确匹配的加载警告，不等同于输出几何为空。

## 11. 已知限制与排错

- 预览使用的演示 mesh 拓扑较低，因此边缘会保留多边形感；真实输入 mesh 的拓扑密度会直接影响雪层圆润度。
- V2 只增加厚度和剖面体积，没有实现人物脚印或实时踩踏变形。
- `snow_unreal_material` 是 UE 项目路径，材质资源不存在时 Houdini 仍可生成几何，但 UE 不会自动创建材质。
- 若积雪过薄，先提高 `Snow Thickness`、`Base Snow Depth` 和 `Peak Height`；若边缘不明显，提高 `Edge Lip Height`、`Shell Depth` 和 `Overhang Amount`。
- 若雪层覆盖方向错误，检查输入 mesh 的法线方向，再调整 `Slope Start`、`Slope Softness` 和 `Upward Bias`。
- 若单独打开 HIP 出现 `incomplete asset definition`，先安装完整的 `billd_snow_coverage_h21_ue56_v2.hda`，再重新载入场景；不要只把 HIP 文件复制到另一个工程。
- 若 UE 中只看到源 mesh，检查 Houdini Engine 是否加载了 v2 HDA，并确认 Houdini Asset Actor 的输出视图不是 `Source Only`。

## 12. 版本记录

- V1：基础积雪覆盖、边缘堆积、风向偏移、雪点和 UE 属性输出。
- V2：提高默认积雪厚度，新增基础雪深、顶部隆起、边缘翻边、壳体下压和剖面圆润度；将侧面拆成下层和上层两个多环过渡面。
- 2026-07-29：使用 Houdini `21.0.596` 重新生成、保存并验证 v2 HIP/HDA，完成预览和 UE 工程副本同步。
