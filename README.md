# Interactive Intellectual Atlas V0.1

## Reality → Cognition → Action · A Genealogy of Generative Thought
现实如何生成，认知如何成立，行动如何可能

一个可探索的“思想谱系图”：把跨越数学、物理学、复杂系统、认知科学、经济学与投资思想的
23 位人物，组织成一张手工布局的认知地图。它不是人物关系图、不是家谱、不是 force-directed
网络散点——而是一面“科学图谱 / 博物馆信息墙”。

---

## 运行

```bash
npm install
npm run dev        # 开发模式 → http://localhost:5173
npm run build      # 类型检查 + 生产构建
npm run preview    # 预览生产构建 → http://localhost:4173
```

- 桌面优先（1440×900 起步即整图可见），窄屏可平移缩放浏览。
- 无后端、无数据库、无登录；纯前端数据驱动。

## 验收截图

- `screenshots/desktop-1440x900.png` — 1440×900 桌面首屏
- `screenshots/mobile-narrow.png` — 窄屏（初始视图居中放大，可平移探索）

（截图由无头浏览器自动生成；自动化验收脚本见 `tools/`。）

---

## 地图结构

- 横向三大区域：**REALITY**（现实如何生成）→ **COGNITION**（认知如何成立）→ **ACTION**（在不确定中如何行动）
- 纵向抽象深度标尺（14 层）：Representation → Rules → Relations → Emergence → Systems → Causality → Observer → Civilization → Technology/Economy → Market → Asset → Geometry → Permission → Action
- **META-LAYER**：Grothendieck（表示 / 相对结构 / 上升之海），向 Wolfram、Wen、Barabási、Pearl 发出「Structural Resonance 结构同构」虚线
- **三角校准器**（Pearl · Stanovich · Thorp）：中心 *MODEL ≠ REALITY*
- **文明 ↔ 技术-经济范式 ↔ 极端公司** 桥梁：Deutsch · Morris · Perez · Arthur · Li Lu · Anderson
- **EVOLUTIONARY REFLEXIVE SYSTEM**：Arthur（History）· Lo（Adaptation）· Soros（Reflexivity）三角发动机 + 外围循环 History → Agents → Beliefs → Actions → Environment → Selection → New History
- **MARKET ACTION CHAIN 功能链**（琥珀色）：FIELD → GENERATOR → LEADERSHIP → GEOMETRY/PERMISSION → VALIDATION → SIZING（Druckenmiller · Stine · O'Neil · Minervini · Phantom · Thorp）
- **THE CROSSING 交叉处**：缠中说禅（未闭合圆环，Personal Synthesis，刻意不神化、不画“所有人通往他”）
- **CURRENT SYNTHESIS 当前综合工作台**：SENSE → MODEL → ACT → LEARN ↺（开放工作台，非最终理论）

## 交互

- 点击节点 → 其他节点淡化至 22%、一度连接保留、右侧 Detail Panel（角色 / 核心问题 / 核心概念 / 地图贡献 / 连接 / 建议路径）
- **PATH MODE**：6 条预设思想路径（从规则到涌现 / 演化市场 / 技术到极端赢家 / 从发生器到资本 / 如何认知 / 文明到公司），路径节点带序号徽章、连线加粗渐进显现、底部路径说明
- **搜索**：人物名 / 概念 / 关键词（如 Arthur、causality、network、permission），自动定位高亮
- **筛选**：ALL / REALITY / COGNITION / ACTION / META / SYSTEM / MARKET
- **Pan / Zoom / Fit / Reset**（滚轮缩放、拖拽平移、双击缩放已禁用以免误触）
- 图例（克制可折叠）；支持 `prefers-reduced-motion`

## 连线类型

| 类型 | 样式 |
| --- | --- |
| Generative Influence 生成关系 | 实线深蓝 |
| Structural Resonance 结构同构 | 虚线灰蓝 |
| Information Flow 信息流 | 细蓝线 + 缓慢流动 |
| Feedback Loop 反馈 | 绿色双向箭头 |
| Functional Chain 功能链 | 琥珀色 |

## 项目结构

```
├── index.html                  # 入口
├── src/
│   ├── main.tsx / App.tsx      # 挂载 + 状态（选择/搜索/筛选/路径/缩放）
│   ├── styles.css              # ivory · navy · 克制动画
│   ├── types.ts                # Node / Edge / Path schema
│   ├── data/
│   │   ├── nodes.ts            # 24 个节点（含手工坐标、双语内容、符号、层、区、标签）
│   │   ├── edges.ts            # 29 条边（类型/方向/曲线控制点/标签/描述）
│   │   └── paths.ts            # 6 条预设路径
│   ├── lib/
│   │   ├── card.ts             # 节点卡片尺寸（文本宽度自适应）
│   │   └── geometry.ts         # 边路径构造（按卡片边界计算箭头内缩）
│   └── components/
│       ├── AtlasMap（App 内）  # SVG 世界 1600×980 + markers + 滤镜
│       ├── RegionsLayer.tsx    # 区域框架/深度标尺/META 层/发动机/功能链/交叉处/工作台
│       ├── EdgesLayer.tsx      # 连线 + 箭头 + 标签 + 动画
│       ├── NodesLayer.tsx      # 节点层（淡化/徽章/搜索环）
│       ├── NodeCard.tsx        # 节点卡片（居中锚定、hover 轻抬）
│       ├── Symbol.tsx          # 24 个极简 SVG 线性图标（无 emoji、无头像）
│       ├── DetailPanel.tsx / Toolbar.tsx / PathBar.tsx / Legend.tsx
└── tools/
    ├── cdp-check.mjs           # 无头浏览器几何验收（重叠/穿卡/溢出/运行时错误）
    └── cdp-interact.mjs        # 交互验收（38 项断言）
```

### 数据驱动扩展

新增人物只需在 `src/data/nodes.ts` 添加一个节点（含 x/y 手工坐标），在 `edges.ts` 添加边，在
`paths.ts`（可选）加入路径——UI 零改动。已预留：Shannon、Wiener、Turing、Munger、Thiel、
Mandelbrot、Didier Sornette、Edward Dewey、Wyckoff、Gann、Elliott 等。

---

## V0.2 扩展建议

1. **概念视角切换**：从“人物节点”切换到“概念节点”（Concepts / Operators / Questions 作为节点），人物与概念互为超图
2. **人物库扩充**：Shannon、Wiener、Turing、Mandelbrot、Sornette、Munger、Thiel、Wyckoff、Gann、Elliott、Dewey 等（数据文件已就绪，只需坐标与连线）
3. **边标签密度开关**：三档（仅悬停 / 关键标签 / 全部标签），并支持按连线类型过滤
4. **导出**：SVG / PNG / PDF 导出与打印海报排版（SVG 渲染为此预留）
5. **深链分享**：把「选中节点 / 路径 / 筛选 / 视野」编码进 URL
6. **双语切换**：整图 EN / 中文一键切换（数据层已双语）
7. **历史时间轴浮层**：作为可选叠层而非默认结构，保持“思想谱系”而非“年表”的定位
8. **概念间路径推荐**：点击两个节点自动计算并高亮最短思想路径
9. **数据 JSON Schema + 校验脚本**：把 `types.ts` 升级为可发布的 schema，配合 `tools/` 验收脚本做 CI
10. **移动端专用布局**：小屏下提供“区域导航条”（REALITY/COGNITION/ACTION 快速跳转）

> V0.1 原则：不做后端、登录、数据库、AI 聊天、头像、CMS、时间轴、3D；只做“阅读体验”。
