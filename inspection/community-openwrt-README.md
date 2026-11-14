# 烽火 LG6121F OpenWrt 移植项目

> 将主线 OpenWrt 移植到 FiberHome LG6121F 5G CPE (MediaTek MT6890/T750)

## 快速开始

### Docker 构建 (推荐)

```bash
./scripts/docker-build.sh build
```

### 原生 Linux 构建

```bash
./scripts/build.sh all
```

## 项目结构

```
烽火openwrt/
├── target/linux/mediatek/     # OpenWrt 目标补丁
│   ├── dts/                   # 设备树文件
│   ├── patches-6.6/           # 内核补丁
│   ├── mt6890/                # 子目标配置
│   └── image/                 # 镜像构建规则
├── configs/                   # OpenWrt 配置
├── scripts/                   # 构建脚本
├── Dockerfile                 # Docker 构建环境
└── docs/                      # 开发文档
```

## 硬件概览

| 项目 | 规格 |
|------|------|
| SoC | MediaTek MT6890 (T750) |
| CPU | ARM Cortex-A55 四核 2GHz |
| RAM | 1GB |
| Flash | 512MB NAND (UBI) |
| Wi-Fi | Wi-Fi 6 AX1800 (MT7915) |
| 5G | T750 集成 Sub-6GHz |
| 以太网 | 2x 千兆 (SGMII) |

## 开发状态

- [x] 项目结构搭建
- [x] SoC 设备树 (DTS/DTSI)
- [x] 内核补丁框架
- [x] OpenWrt 子目标配置
- [x] Base-files 和网络配置
- [x] Docker 构建环境
- [x] 开发文档
- [ ] 寄存器地址验证 (需要设备 SSH 访问)
- [ ] 首次编译测试 (需要 Linux 环境)
- [ ] 设备刷机验证
- [ ] 5G/Wi-Fi 功能验证

## 详细文档

参见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
