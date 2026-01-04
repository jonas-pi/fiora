#!/bin/bash
# 强制设置临时目录环境变量并执行构建
export TMPDIR=/opt/fiora/tmp
export TMP=/opt/fiora/tmp
export TEMP=/opt/fiora/tmp
mkdir -p /opt/fiora/tmp

# 执行构建命令
cd "$(dirname "$0")"
exec yarn build:web
