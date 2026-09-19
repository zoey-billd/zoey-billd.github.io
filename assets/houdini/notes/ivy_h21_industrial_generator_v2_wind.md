# Houdini 21 工业化藤蔓生成器 v2 - Wind Sway

生成时间：2026-07-03 10:55:29

## 产物

- Houdini 21 商业工程：`C:/Games/Houdini/HoudiniProject\ivy_h21_industrial_generator_v2_wind.hip`
- Houdini 21 商业 HDA：`C:/Games/Houdini/HoudiniProject\hda\billd_ivy_generator_h21_industrial_v2_wind.hda`
- 生成脚本：`C:/Games/Houdini/HoudiniProject\create_h21_ivy_industrial_generator_v2.py`
- 验证 JSON：`C:/Games/Houdini/HoudiniProject\analysis\ivy_h21_industrial_generator_v2_wind_verification.json`

## v2 新增内容

- 新增 `Wind Controls` 参数组。
- 新增 `wind_sway_amp`：风摆总强度。
- 新增 `wind_leaf_multiplier`：叶片摆动倍率，默认比细藤更大。
- 新增 `wind_tendril_multiplier`：细藤和枝梢摆动倍率。
- 新增 `wind_speed` 与 `wind_turbulence`：控制预览动画速度和相位变化。
- 藤蔓曲线、闭合藤蔓 mesh、叶片点都会写出 `wind_sway_amp`、`wind_phase`、`wind_role`。
- Houdini 视口里会随当前帧产生预览摆动；UE 侧可以读取这些属性做材质风或实例风。

## 保留能力

- 参数面板保留 `ivy_v8` 的核心控制：`density`、`base_width`、`leaf_size`、`preview_lowres`、`vine_point_budget`、`leaf_point_budget`、`lod_resample_multiplier`、`polyreduce_keep`。
- 输入 0 接建筑表面；没有输入时自动使用内置测试墙面。
- 输入 1 可接自定义叶片模型；没有输入时使用内置叶片卡片预览。
- `leaf_mesh_path` 会写入 `unreal_instance`，用于 UE/Houdini Engine 替换 Static Mesh 叶片。
- `OUT_UNREAL_COMBINED` 合并藤蔓 mesh 和叶片 instancing points；另外保留分层输出和调试输出。

## 主要输出节点

- `OUT_UNREAL_COMBINED`：UE 主输出，藤蔓 mesh + 叶片点。
- `OUT_VINES_MESH`：闭合藤蔓网格，带风属性。
- `OUT_LEAF_POINTS`：叶片实例点，带 `unreal_instance`、`unreal_material`、`unreal_output_name`、`pscale`、`orient`、`N`、`up` 和风属性。
- `OUT_LEAF_MESH_PREVIEW`：Houdini 视口预览，可用输入 1 的叶片模型。
- `OUT_DEBUG_MASK`：建筑表面/内置墙面 mask 调试。
- `OUT_DEBUG_CONNECTIONS`：藤蔓连接线调试。
- `OUT_VINE_CURVES`：带 `width/pscale/ivy_id` 和风属性的藤条曲线。

## H21 clean session 验证摘要

- 授权：`licenseCategoryType.Commercial`
- Houdini：`21.0.631`
- HDA 类型：`billd::ivy_generator_h21_industrial::2.0`
- 输入：`['/obj/TEST_BUILDING_SURFACE_INPUT', '/obj/TEST_CUSTOM_LEAF_INPUT']`
- `OUT_VINES_MESH`：5178 points / 4630 prims，boundary edges 0
- `OUT_LEAF_POINTS`：10 points / 0 prims
- `OUT_UNREAL_COMBINED`：5188 points / 4630 prims
- 叶片 frame 1 -> 24 平均位移：0.072303
- 细藤 frame 1 -> 24 平均位移：0.031920
- 叶片归零风摆对照位移：0.044534

## 完整验证

```json
{
  "type": "billd::ivy_generator_h21_industrial::2.0",
  "definition": "C:/Games/Houdini/HoudiniProject/hda/billd_ivy_generator_h21_industrial_v2_wind.hda",
  "inputs": [
    "/obj/TEST_BUILDING_SURFACE_INPUT",
    "/obj/TEST_CUSTOM_LEAF_INPUT"
  ],
  "outputs": {
    "OUT_UNREAL_COMBINED": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_UNREAL_COMBINED",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 5188,
      "prims": 4630,
      "bbox": {
        "min": [
          -2.067453622817993,
          -0.04389572888612747,
          -0.9999372959136963
        ],
        "max": [
          2.5918760299682617,
          6.300319671630859,
          0.5831689834594727
        ]
      },
      "point_attribs": [
        "Cd",
        "N",
        "P",
        "ivy_id",
        "leaf_id",
        "name",
        "orient",
        "pscale",
        "ue_output",
        "unreal_instance",
        "unreal_material",
        "unreal_output_name",
        "up",
        "uv",
        "wind_phase",
        "wind_role",
        "wind_sway_amp"
      ],
      "prim_attribs": [
        "name",
        "ue_output",
        "unreal_material",
        "unreal_output_name"
      ]
    },
    "OUT_VINES_MESH": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_VINES_MESH",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 5178,
      "prims": 4630,
      "bbox": {
        "min": [
          -2.067453622817993,
          -0.04389572888612747,
          -0.9999372959136963
        ],
        "max": [
          2.5918760299682617,
          6.300319671630859,
          0.5831689834594727
        ]
      },
      "point_attribs": [
        "Cd",
        "N",
        "P",
        "ivy_id",
        "uv",
        "wind_phase",
        "wind_role",
        "wind_sway_amp"
      ],
      "prim_attribs": [
        "name",
        "ue_output",
        "unreal_material",
        "unreal_output_name"
      ],
      "boundary_edges": 0
    },
    "OUT_LEAF_POINTS": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_LEAF_POINTS",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 10,
      "prims": 0,
      "bbox": {
        "min": [
          -1.2951070070266724,
          1.3089555501937866,
          -0.18100334703922272
        ],
        "max": [
          2.129770517349243,
          6.141014099121094,
          0.19596296548843384
        ]
      },
      "point_attribs": [
        "Cd",
        "N",
        "P",
        "ivy_id",
        "leaf_id",
        "name",
        "orient",
        "pscale",
        "ue_output",
        "unreal_instance",
        "unreal_material",
        "unreal_output_name",
        "up",
        "wind_phase",
        "wind_role",
        "wind_sway_amp"
      ],
      "prim_attribs": []
    },
    "OUT_LEAF_MESH_PREVIEW": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_LEAF_MESH_PREVIEW",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 10,
      "prims": 10,
      "bbox": {
        "min": [
          -1.2976690530776978,
          1.3087881803512573,
          -0.18142879009246826
        ],
        "max": [
          2.13177490234375,
          6.145862102508545,
          0.19636818766593933
        ]
      },
      "point_attribs": [
        "P"
      ],
      "prim_attribs": []
    },
    "OUT_DEBUG_MASK": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_DEBUG_MASK",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 8,
      "prims": 6,
      "bbox": {
        "min": [
          -2.0,
          0.0,
          -0.10000000149011612
        ],
        "max": [
          2.0,
          5.5,
          0.10000000149011612
        ]
      },
      "point_attribs": [
        "Cd",
        "N",
        "P",
        "mask"
      ],
      "prim_attribs": [
        "name",
        "ue_output"
      ]
    },
    "OUT_DEBUG_CONNECTIONS": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_DEBUG_CONNECTIONS",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 863,
      "prims": 137,
      "bbox": {
        "min": [
          -2.0672483444213867,
          -0.054266612976789474,
          -0.9988516569137573
        ],
        "max": [
          2.591019630432129,
          6.300170421600342,
          0.5803771615028381
        ]
      },
      "point_attribs": [
        "Cd",
        "P",
        "ivy_id",
        "wind_phase",
        "wind_role",
        "wind_sway_amp"
      ],
      "prim_attribs": [
        "name",
        "ue_output"
      ]
    },
    "OUT_VINE_CURVES": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_VINE_CURVES",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 863,
      "prims": 137,
      "bbox": {
        "min": [
          -2.066211700439453,
          -0.019266610965132713,
          -0.9988516569137573
        ],
        "max": [
          2.591019630432129,
          6.300170421600342,
          0.5803771615028381
        ]
      },
      "point_attribs": [
        "N",
        "P",
        "curveu",
        "ivy_id",
        "pscale",
        "width",
        "wind_phase",
        "wind_role",
        "wind_sway_amp"
      ],
      "prim_attribs": [
        "name",
        "ue_output",
        "unreal_output_name"
      ]
    },
    "OUT_PREVIEW_MESH": {
      "path": "/obj/ivy_h21_wind_clean_session_test/OUT_PREVIEW_MESH",
      "type": "null",
      "errors": [],
      "warnings": [],
      "points": 5188,
      "prims": 4640,
      "bbox": {
        "min": [
          -2.067453622817993,
          -0.04389572888612747,
          -0.9999372959136963
        ],
        "max": [
          2.5918760299682617,
          6.300319671630859,
          0.5831689834594727
        ]
      },
      "point_attribs": [
        "Cd",
        "N",
        "P",
        "ivy_id",
        "uv",
        "wind_phase",
        "wind_role",
        "wind_sway_amp"
      ],
      "prim_attribs": [
        "name",
        "ue_output",
        "unreal_material",
        "unreal_output_name"
      ]
    }
  },
  "parameter_probe": {
    "preview_lowres_probe": {
      "preview_points": 5178,
      "full_points": 47320
    },
    "leaf_budget_probe": {
      "zero_leaf_points": 0,
      "restored_leaf_points": 10
    },
    "unreal_instance_probe": {
      "test_path": "/Game/Foliage/SM_Ivy_Leaf.SM_Ivy_Leaf",
      "sample_values": [
        "/Game/Foliage/SM_Ivy_Leaf.SM_Ivy_Leaf",
        "/Game/Foliage/SM_Ivy_Leaf.SM_Ivy_Leaf",
        "/Game/Foliage/SM_Ivy_Leaf.SM_Ivy_Leaf",
        "/Game/Foliage/SM_Ivy_Leaf.SM_Ivy_Leaf",
        "/Game/Foliage/SM_Ivy_Leaf.SM_Ivy_Leaf"
      ]
    },
    "wind_motion_probe": {
      "frame_1": 1,
      "frame_24": 24,
      "leaf_avg_delta": 0.07230347586219156,
      "thin_vine_mesh_avg_delta": 0.03191974533839068,
      "leaf_zero_wind_delta_at_frame_24": 0.044534497154665995,
      "wind_sway_amp": 0.035
    }
  }
}
```
