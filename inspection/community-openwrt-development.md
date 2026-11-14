# FiberHome LG6121F OpenWrt 移植开发文档

## 项目概述

本项目旨在将主线 OpenWrt 移植到 FiberHome LG6121F 5G CPE 设备上。

- **设备**: FiberHome LG6121F (烽火 5G CPE 一代)
- **SoC**: MediaTek MT6890 (T750 平台)
- **当前系统**: OpenWrt 19.07.7 (Linux 4.19.190)
- **目标系统**: OpenWrt 主线 (Linux 6.6+)

---

## 一、硬件规格

### 1.1 SoC: MediaTek MT6890 (T750)

| 项目 | 规格 |
|------|------|
| CPU | ARMv8 Cortex-A55 四核 @ 2GHz |
| 制程 | 7nm |
| 5G 调制解调器 | 集成 Sub-6GHz 5G NR (3GPP Rel-15) |
| 以太网 | 2x 2.5Gbps SGMII |
| PCIe | 用于 Wi-Fi 模块连接 |
| USB | USB 3.0 |
| PMIC | MT6315 |
| RF 收发器 | MT6190 |

### 1.2 设备硬件

| 项目 | 规格 |
|------|------|
| 内存 | 1GB |
| 存储 | 512MB NAND Flash (UBI) |
| Wi-Fi | Wi-Fi 6 AX1800 (MediaTek MT7915 via PCIe) |
| 以太网 | 2x 千兆 (RTL8221FS PHY) |
| 5G | T750 集成调制解调器 (Sub-6GHz) |
| 接口 | 2x GE, 1x USB, 1x Nano-SIM, 1x Reset, 1x WPS |
| LED | 电源, WiFi 2.4G/5G, 5G 信号 x3, 网络 |
| 引导加载器 | Little Kernel (LK) |
| 分区方案 | A/B 双分区 + bootctrl |

### 1.3 5G 频段支持

- **5G NR**: n1/n3/n5/n7/n8/n20/n28/n38/n40/n41/n77/n78
- **4G LTE**: B1/B3/B5/B7/B8/B20/B28/B32/B38/B40/B41/B42/B43
- **峰值速率**: DL 3.8Gbps / UL 2.5Gbps

---

## 二、分区布局

设备采用 A/B 双分区设计，用于安全 OTA 升级。

### 2.1 A/B 镜像分区

| 分区 | Slot A MTD | Slot B MTD | 大小 | 说明 |
|------|-----------|-----------|------|------|
| lk | 25 | 38 | 2 MB | Little Kernel 引导加载器 |
| boot | 27 | 40 | 32 MB | Linux 内核 |
| rootfs_sig | 28 | 41 | 1 MB | 固件签名 |
| rootfs | 29 | 42 | 64 MB | 根文件系统 (squashfs) |
| md1img | 17 | 30 | 80 MB | 5G modem 固件 |
| md1dsp | 18 | 31 | 10 MB | 5G DSP |

### 2.2 共享分区

| 分区 | MTD | 大小 | 说明 |
|------|-----|------|------|
| misc | 3 | 1 MB | bootctrl 数据 (偏移 0x800) |
| user_data | 48 | 44 MB | 用户数据 |
| factory | - | 4 MB | 出厂校准数据 (MAC 地址等) |

### 2.3 Bootctrl 结构

位于 misc 分区偏移 0x800，共 16 字节:

```
偏移    内容
+0      magic: 0x00414230 ("AB0")
+4      padding: 0xFFFFFFFF
+8      priority_a (高值优先启动)
+9      try_a (重试计数)
+10     success_a (0x01 = 确认成功)
+11     up_a (升级类型)
+12~15  priority_b, try_b, success_b, up_b
```

---

## 三、移植方案

### 3.1 移植策略

由于 MT6890 不在主线 Linux/OpenWrt 支持列表中，需要:

1. **创建 SoC 设备树** (DTS/DTSI) - 描述 MT6890 硬件
2. **编写内核补丁** - 添加 MT6890 时钟、pinctrl 驱动
3. **添加驱动兼容字符串** - 使现有 MediaTek 驱动支持 MT6890
4. **创建 OpenWrt 子目标** - 构建/镜像/配置
5. **处理 LK 引导兼容** - 生成 LK 兼容的启动镜像

### 3.2 文件结构

```
烽火openwrt/
├── target/linux/mediatek/
│   ├── dts/
│   │   ├── mt6890.dtsi                    # SoC 级设备树
│   │   ├── mt6890-fiberhome-lg6121f.dts   # 板级设备树
│   │   ├── mt6890-clk.h                   # 时钟绑定头文件
│   │   └── mt6890-power.h                 # 电源域头文件
│   ├── patches-6.6/
│   │   ├── 001-dt-bindings-arm-mediatek-mt6890.patch     # DT 绑定
│   │   ├── 002-clk-mediatek-mt6890-support.patch         # 时钟驱动
│   │   ├── 003-pinctrl-mediatek-mt6890-support.patch     # 引脚控制
│   │   ├── 004-soc-mediatek-mt6890-compat.patch          # 驱动兼容
│   │   └── 005-arm64-dts-mt6890-add-support.patch        # DTS 编译
│   ├── mt6890/
│   │   ├── target.mk                      # 子目标定义
│   │   ├── config-6.6                     # 内核配置
│   │   └── base-files/
│   │       ├── etc/board.d/
│   │       │   ├── 01_leds                # LED 配置
│   │       │   └── 02_network             # 网络配置
│   │       ├── etc/hotplug.d/ieee80211/
│   │       │   └── 11_fix_wifi_mac        # Wi-Fi MAC 修复
│   │       ├── etc/uci-defaults/
│   │       │   └── 99_lg6121f_setup       # 首次启动配置
│   │       └── lib/upgrade/
│   │           └── platform.sh            # 升级脚本
│   └── image/
│       └── mt6890.mk                      # 镜像构建规则
├── configs/
│   └── lg6121f.config                     # OpenWrt 配置
├── scripts/
│   ├── build.sh                           # 构建脚本
│   └── docker-build.sh                    # Docker 构建脚本
├── Dockerfile                             # 构建环境
└── docs/
    └── DEVELOPMENT.md                     # 本文档
```

### 3.3 关键技术挑战

#### 挑战 1: MT6890 SoC 支持

MT6890 不在主线 Linux 中。需要添加:
- **时钟驱动**: topckgen, infracfg, pericfg, apmixedsys
- **Pinctrl 驱动**: GPIO 引脚复用配置
- **设备树**: SoC 级和板级 DTS 文件

**状态**: 框架代码已编写，寄存器地址需从 SDK 或设备 dump 验证。

#### 挑战 2: LK 引导加载器

设备使用 Little Kernel (LK)，非 U-Boot:
- LK 使用 Android boot image 格式
- 需要将 OpenWrt 内核打包为 LK 兼容格式
- A/B 分区切换需要操作 bootctrl 数据

**解决方案**: 使用 `mkbootimg` 生成 Android boot image，通过修改 misc 分区切换启动槽位。

#### 挑战 3: 5G 调制解调器

T750 集成 5G modem:
- 主线 Linux 有 `mtk_t7xx` 驱动 (drivers/net/wwan/t7xx/)
- 需要确认 modem 连接方式 (PCIe/内部总线)
- 需要 5G modem 固件 (md1img 分区)

**解决方案**: 使用 `kmod-mtk-t7xx` + `uqmi`/`mbim-utils` 支持 5G 数据连接。

#### 挑战 4: Wi-Fi 6

Wi-Fi 芯片 (MT7915) 通过 PCIe 连接:
- 主线 `mt76` 驱动支持 MT7915
- 需要正确的 PCIe 配置和校准数据

**解决方案**: 使用 `kmod-mt7915e` 驱动，校准数据从 factory 分区读取。

#### 挑战 5: MTD 写保护

烽火通过驱动层 ioctl 控制 NAND 写保护:
- 解锁 ioctl 码: `0x40085318`
- 需要交叉编译 `mtd_unlock` 工具

**解决方案**: 构建 `mtd_unlock` 工具，在刷写分区前解锁。

---

## 四、构建指南

### 4.1 环境要求

- **操作系统**: Ubuntu 22.04 (或通过 Docker)
- **内存**: 至少 4GB (推荐 8GB+)
- **磁盘**: 至少 20GB 可用空间
- **网络**: 需要访问 GitHub 和 OpenWrt 源码仓库

### 4.2 Docker 构建 (推荐，macOS 适用)

```bash
# 1. 构建 Docker 镜像
./scripts/docker-build.sh image

# 2. 编译固件 (全流程)
./scripts/docker-build.sh build

# 或者分步执行
./scripts/docker-build.sh build clone    # 克隆 OpenWrt 源码
./scripts/docker-build.sh build patches  # 应用 MT6890 补丁
./scripts/docker-build.sh build feeds    # 安装 feeds
./scripts/docker-build.sh build config   # 配置
./scripts/docker-build.sh build build    # 编译

# 3. 获取交互式 shell
./scripts/docker-build.sh shell
```

### 4.3 原生 Linux 构建

```bash
# 1. 安装依赖
sudo apt update
sudo apt install -y build-essential gcc g++ make cmake git subversion \
    bzip2 xz-utils zlib1g-dev file awk gawk sed grep diffutils patch \
    wget curl rsync python3 python3-dev python3-pip \
    libncurses-dev libreadline-dev libssl-dev libelf-dev \
    libglib2.0-dev libgmp3-dev libmpc-dev libmpfr-dev \
    flex bison gettext intltool help2man texinfo unzip p7zip-full \
    pkg-config device-tree-compiler qemu-utils swig

# 2. 克隆并构建
./scripts/build.sh all
```

### 4.4 构建输出

编译成功后，固件位于:
```
openwrt/bin/targets/mediatek/mt6890/
├── openwrt-mediatek-mt6890-fiberhome_lg6121f-squashfs-sysupgrade.bin
├── openwrt-mediatek-mt6890-fiberhome_lg6121f-boot.img
└── openwrt-mediatek-mt6890-fiberhome_lg6121f-initramfs.itb
```

---

## 五、刷机指南

### 5.1 前置条件

1. 获取设备 SSH 访问权限 (参考 codming.com 安全研究)
2. 准备 `mtd_unlock` 工具 (交叉编译)
3. 备份当前固件 (所有分区)

### 5.2 备份原厂固件

```bash
# 通过 SSH 连接设备
ssh root@192.168.8.1

# 备份所有分区
for i in $(seq 0 48); do
    nanddump --skip-bad-blocks-to-start /dev/mtd$i -f /data/mtd${i}_backup
done

# 传输备份到电脑
scp -r root@192.168.8.1:/data/mtd*_backup ./
```

### 5.3 刷写 OpenWrt 固件

```bash
# 1. 上传固件到设备
scp openwrt-mediatek-mt6890-fiberhome_lg6121f-squashfs-sysupgrade.bin \
    root@192.168.8.1:/tmp/

# 2. 通过 SSH 执行刷写
ssh root@192.168.8.1

# 解锁目标分区 (使用 mtd_unlock 工具)
# 确定 inactive slot (假设为 B)
/data/mtd_unlock 40      # 解锁 boot_b
/data/mtd_unlock 42      # 解锁 rootfs_b

# 写入内核到 boot_b
ubiattach -p /dev/mtd40 -d 3 2>/dev/null || true
mtd write /tmp/openwrt-*.bin boot_b

# 写入 rootfs
mtd write /tmp/openwrt-*.bin rootfs_b

# 切换启动槽位到 B
. /lib/functions.sh; . /lib/functions/system.sh
/data/mtd_unlock 3
set_bootctrl_string 1 0e 0 00 1 01 0 00 1 0f 0 00 1 01 0 00
/data/mtd_unlock 3 lock

# 重启
reboot
```

### 5.4 恢复原厂固件

如果 OpenWrt 无法启动，LK 会自动回退到原厂分区 (Slot A)。

如需手动恢复:
```bash
# 切换回 Slot A
/data/mtd_unlock 3
set_bootctrl_string 1 0f 0 00 1 01 0 00 1 0e 0 00 1 01 0 00
/data/mtd_unlock 3 lock
reboot
```

---

## 六、已知问题和后续计划

### 6.1 需要验证的项目

| 项目 | 说明 | 验证方法 |
|------|------|---------|
| 寄存器地址 | DTS 中的 SoC 外设地址 | 从设备 dump `/proc/iomem` |
| 时钟树 | PLL 和分频器配置 | 从 SDK 获取或 dump `/sys/kernel/debug/clk/` |
| GPIO 编号 | LED/按键的 GPIO 分配 | 从设备 dump `/sys/kernel/debug/pinctrl/` |
| Wi-Fi 芯片型号 | 确认是 MT7915 还是其他 | `lspci` 或拆机确认 |
| 5G modem 连接方式 | PCIe 还是内部总线 | `lspci` 或 `/sys/bus/` |
| NAND 参数 | 页大小、OOB 大小 | `/proc/mtd` 和 `nanddump` |

### 6.2 后续开发计划

1. **Phase 1: 设备信息采集**
   - 通过 SSH 获取设备 DTS、寄存器映射、GPIO 配置
   - 确认 Wi-Fi 芯片型号和 PCIe 拓扑
   - 确认 5G modem 连接方式

2. **Phase 2: 内核引导**
   - 验证并修正设备树寄存器地址
   - 实现串口控制台输出
   - 实现 NAND 分区识别

3. **Phase 3: 外设驱动**
   - 验证以太网 (SGMII) 驱动
   - 验证 Wi-Fi (MT7915) 驱动
   - 验证 5G modem (T7xx) 驱动

4. **Phase 4: 完整系统**
   - 验证 LuCI Web 界面
   - 验证 5G 拨号功能
   - 验证 sysupgrade 升级
   - 性能优化

### 6.3 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 寄存器地址错误 | 内核无法启动 | A/B 分区回退机制 |
| 5G modem 驱动不兼容 | 5G 功能不可用 | 保留原厂 modem 固件分区 |
| Wi-Fi 驱动不兼容 | Wi-Fi 不可用 | 确认芯片型号后选择正确驱动 |
| LK 引导格式不兼容 | 无法启动 | 使用 initramfs 调试 |
| NAND 写保护 | 无法刷写 | 使用 mtd_unlock 工具 |

---

## 七、参考资料

### 7.1 设备相关
- [烽火 LG6121F 5G CPE 安全研究](https://codming.com/posts/fiberhome-lg6121f-5g-cpe-research/)
- [烽火 5G CPE Air 拆机评测 (含 LG6121F 对比)](https://www.acwifi.net/30733.html)
- [烽火 LG6121F 拆机与评测](https://jb51.net/network/799262_4.html)
- [FiberHome LG6121F 官方页面](https://en.fiberhome.com/5GCPE/20240722/46948.html)

### 7.2 OpenWrt 开发
- [OpenWrt 官方 Wiki](https://openwrt.org/)
- [OpenWrt MediaTek 目标源码](https://git.openwrt.org/openwrt/openwrt.git)
- [OpenWrt 构建系统文档](https://openwrt.org/docs/guide-developer/build-system)
- [OpenWrt 设备移植指南](https://openwrt.org/docs/guide-developer/adding_new_device)

### 7.3 MediaTek 相关
- [MediaTek T750 平台介绍](https://blog.csdn.net/wgl307293845/article/details/140977075)
- [Linux MediaTek 时钟驱动](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/clk/mediatek)
- [Linux MediaTek Pinctrl 驱动](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/pinctrl/mediatek)
- [Linux MediaTek T7xx 5G Modem 驱动](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/net/wwan/t7xx)
- [mt76 Wi-Fi 驱动](https://github.com/openwrt/mt76)

### 7.4 内核设备树
- [Linux 设备树文档](https://www.kernel.org/doc/html/latest/devicetree/usage-model.html)
- [MediaTek ARM64 DTS](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/arch/arm64/boot/dts/mediatek)

---

## 八、许可证

本项目代码遵循 GPL-2.0 许可证，与 OpenWrt 项目保持一致。

---

*文档版本: 1.0*
*最后更新: 2025-08-04*
