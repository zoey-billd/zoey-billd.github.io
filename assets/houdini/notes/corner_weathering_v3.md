# Corner Weathering HDA V3

## 项目概述

Houdini 原生 SOP/VEX 工具，模拟混凝土方块从指定角落沿表面逐渐风化、剥落并露出新鲜断口的过程。非破坏性增量管线，以 HDA 形式复用。

## 文件与要求

- 场景：`corner_weathering_v1.hip`
- Houdini：`21.0.596`
- 主 HDA：`/obj/CORNER_WEATHERING_LAB/CORNER_WEATHERING_V1`
- HDA 类型：`billd::corner_weathering::1.0`

## 快速使用

1. 打开 HIP，选择 `CORNER_WEATHERING_V1`。
2. 拖动 `Age`（0 → 1）查看风化从角落向外蔓延。
3. V3 增量层 `CORNER_WEATHERING_V3_BRITTLE` 提供「脆性 Brittleness」与「位移倍率 Amp Scale」两个滑块，控制断口形态。

## 主要能力

- 沿表面测地距离扩散，风化绕结构蔓延而非球面扩散。
- 固定候选点 + 时间窗过滤，`Age` 拖动稳定不跳变。
- 断面微观起伏（多尺度噪声）+ 骨料色斑，破除程序化切割模板感。
- 脆性参数联动位移幅度、边界过渡宽度、噪声频谱与色斑对比，统一描述材料断裂属性。

## 验证

- 拓扑：开放边 / 非流形边 = 0。
- 位移：毫米级，随脆性参数单调变化。
- 渲染零错误。

## 已知限制

- 边界条件为硬判断 + 软衰减近似，未做真实材料断裂力学。
- UE 侧尚未验证。
