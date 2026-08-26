# Industrial Ivy Generator V2

## 项目概览

这是一个面向建筑表面的 Houdini 21 藤蔓生成 HDA。它的目标不是生成一团静态植物，而是把藤蔓覆盖拆成可检查、可替换、可继续交给 UE 的工具输出。

当前版本重点加入了 Wind Controls：藤条、闭合藤蔓 mesh 和叶片实例点都会写出风摆强度、相位和角色属性，便于 UE 侧继续接材质风或实例风。

## 设计目标

- 输入建筑表面后自动生成贴附生长的藤蔓结构；没有输入时保留内置测试墙面，方便快速验证。
- 将藤条 mesh、叶片实例点、mask 调试和连接线调试分层输出，降低检查和交付成本。
- 写出 UE/Houdini Engine 友好的实例路径、材质标记、输出层名称和风摆属性。
- 保留低模预览、点数预算和 polyreduce 控制，方便在作品集展示与性能之间切换。

## 技术流程

1. 表面输入或内置墙面生成可生长 mask。
2. 根据密度、宽度和预算控制生成藤蔓连接曲线。
3. 将藤蔓曲线闭合为 mesh，保证输出不是开放线框。
4. 在藤蔓周围生成叶片实例点，写入 `orient`、`up`、`pscale` 和 `unreal_instance`。
5. 通过 Wind Controls 写入 `wind_sway_amp`、`wind_phase` 和 `wind_role`，区分叶片、藤条和枝梢的摆动。
6. 合并主输出，同时保留 `OUT_VINES_MESH`、`OUT_LEAF_POINTS`、`OUT_DEBUG_MASK` 和 `OUT_DEBUG_CONNECTIONS` 等检查层。

## 主要参数

- `density`：控制整体藤蔓覆盖密度。
- `base_width`：控制藤条基础粗细。
- `leaf_size`：控制叶片实例大小。
- `preview_lowres`：在预览时降低复杂度。
- `vine_point_budget` / `leaf_point_budget`：限制藤蔓与叶片点数。
- `wind_sway_amp`：风摆总强度。
- `wind_leaf_multiplier`：叶片摆动倍率。
- `wind_tendril_multiplier`：细藤与枝梢摆动倍率。
- `wind_speed` / `wind_turbulence`：控制风摆速度与相位扰动。

## 输出与验证

- `OUT_UNREAL_COMBINED`：UE 主输出，包含藤蔓 mesh 与叶片实例点。
- `OUT_VINES_MESH`：闭合藤蔓网格，带风属性。
- `OUT_LEAF_POINTS`：叶片实例点，带方向、缩放、实例路径和风属性。
- `OUT_LEAF_MESH_PREVIEW`：Houdini 视口叶片预览。
- `OUT_DEBUG_MASK`：表面生长 mask 调试。
- `OUT_DEBUG_CONNECTIONS`：藤蔓连接线调试。

在 clean session 中，主输出约 5k 点、4.6k 面，叶片与细藤在帧变化中能产生不同幅度的预览位移。这个验证重点是证明 HDA 可加载、可 cook、分层输出稳定，并且风摆属性确实影响视口预览。

## 作品集展示重点

- 封面展示藤蔓贴附在工业墙面上的整体效果。
- 详情页突出“surface mask -> vine curves -> leaf points -> wind attributes”的工具链。
- 后续可以补充 UE 材质风、实例替换和参数面板截图，让面试官看到这个工具如何从 Houdini 交给引擎。
