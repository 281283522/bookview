#!/usr/bin/env python3
"""
验证短剧剧本格式和拍摄可行性的脚本

用法:
    # 检查单集剧本
    python validate_script.py short-dramas/短剧名/第01集.md

    # 检查所有集数
    python validate_script.py --all short-dramas/短剧名/

    # 检查并输出详细报告
    python validate_script.py short-dramas/短剧名/第01集.md --verbose
"""

import os
import sys
import re


def count_chinese_chars(text):
    """统计中文字符数"""
    return len(re.findall(r'[\u4e00-\u9fff]', text))


def parse_scene(lines):
    """解析剧本中的场景"""
    scenes = []
    current_scene = None
    in_scene = False

    for line in lines:
        scene_match = re.match(r'###\s+场景\d+[：:]\s*(.*)', line)
        if scene_match:
            if current_scene:
                scenes.append(current_scene)
            current_scene = {
                'title': scene_match.group(1).strip(),
                'time': '',
                'location': '',
                'characters': [],
                'dialogue_count': 0,
                'description_length': 0,
            }
            in_scene = True
            continue

        if in_scene and current_scene:
            if re.match(r'-*\s*时间[：:]\s*(.*)', line):
                current_scene['time'] = re.match(r'-*\s*时间[：:]\s*(.*)', line).group(1).strip()
            elif re.match(r'-*\s*地点[：:]\s*(.*)', line):
                current_scene['location'] = re.match(r'-*\s*地点[：:]\s*(.*)', line).group(1).strip()
            elif re.match(r'-*\s*人物[：:]\s*(.*)', line):
                chars = re.match(r'-*\s*人物[：:]\s*(.*)', line).group(1).strip()
                current_scene['characters'] = [c.strip() for c in chars.replace('、', ',').replace('，', ',').split(',')]
            elif re.match(r'\[.*?\][：:].*', line):
                current_scene['dialogue_count'] += 1
            elif line.strip() and not re.match(r'[#\-]', line):
                current_scene['description_length'] += len(line.strip())

    if current_scene:
        scenes.append(current_scene)

    return scenes


def validate_single_script(file_path, verbose=False):
    """验证单个剧本文件"""
    if not os.path.exists(file_path):
        print(f"错误: 文件 {file_path} 不存在")
        return False

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        lines = content.split('\n')
        word_count = count_chinese_chars(content)
        scenes = parse_scene(lines)

        print(f"\n📄 {os.path.basename(file_path)}")
        print(f"{'='*50}")
        print(f"总字数: {word_count}")
        print(f"场景数: {len(scenes)}")

        issues = []

        # 检查字数
        if word_count < 1500:
            issues.append(f"⚠️  字数偏少（{word_count}字），建议扩充至1500字以上")
        elif word_count > 7000:
            issues.append(f"⚠️  字数偏多（{word_count}字），建议精简至7000字以内")

        # 检查场景
        if len(scenes) == 0:
            issues.append("❌ 未检测到场景标题（格式应为 ### 场景1：名称）")
        elif len(scenes) > 7:
            issues.append(f"⚠️  场景过多（{len(scenes)}个），建议控制在7个以内便于拍摄")

        # 检查每个场景
        all_characters = set()
        for i, scene in enumerate(scenes, 1):
            if verbose:
                print(f"\n  场景{i}: {scene['title']}")
                print(f"    时间: {scene['time'] or '未设置'}")
                print(f"    地点: {scene['location'] or '未设置'}")
                print(f"    角色: {', '.join(scene['characters']) if scene['characters'] else '未设置'}")
                print(f"    对话数: {scene['dialogue_count']}")

            if not scene['time']:
                issues.append(f"⚠️  场景{i}「{scene['title']}」缺少时间设置")
            if not scene['location']:
                issues.append(f"⚠️  场景{i}「{scene['title']}」缺少地点设置")
            if not scene['characters']:
                issues.append(f"⚠️  场景{i}「{scene['title']}」缺少角色设置")
            if scene['dialogue_count'] == 0:
                issues.append(f"⚠️  场景{i}「{scene['title']}」没有对话")

            all_characters.update(scene['characters'])

        # 检查总角色数
        total_chars = len(all_characters)
        if total_chars > 5:
            issues.append(f"⚠️  总角色过多（{total_chars}个），建议控制在5个以内便于拍摄")
        elif total_chars == 0:
            issues.append("⚠️  未检测到角色")

        # 输出检查结果
        if issues:
            print(f"\n{'🔍 发现问题':-^50}")
            for issue in issues:
                print(f"  {issue}")
            print()
            return False
        else:
            print(f"\n✅ 剧本格式正确，拍摄可行性良好")
            print()
            return True

    except Exception as e:
        print(f"错误: 读取文件时出错 - {e}")
        return False


def validate_all_scripts(directory, verbose=False):
    """检查目录中所有剧本"""
    if not os.path.exists(directory):
        print(f"错误: 目录 {directory} 不存在")
        return False

    script_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if re.match(r'第\d+集.*\.md$', file):
                script_files.append(os.path.join(root, file))

    if not script_files:
        print(f"错误: 目录 {directory} 中未找到剧本文件（格式：第X集*.md）")
        return False

    print(f"找到 {len(script_files)} 个剧本文件")
    print("=" * 60)

    all_passed = True
    for file_path in sorted(script_files):
        if not validate_single_script(file_path, verbose):
            all_passed = False

    if all_passed:
        print("所有剧本格式正确 ✅")
    else:
        print("\n部分剧本存在格式问题，请根据提示修改")

    return all_passed


def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  # 检查单个剧本")
        print("  python validate_script.py short-dramas/短剧名/第01集.md")
        print("  ")
        print("  # 检查所有剧本")
        print("  python validate_script.py --all short-dramas/短剧名/")
        print("  ")
        print("  # 详细模式")
        print("  python validate_script.py short-dramas/短剧名/第01集.md --verbose")
        sys.exit(1)

    verbose = '--verbose' in sys.argv or '-v' in sys.argv
    # 清理参数，只保留路径和模式
    args = [a for a in sys.argv[1:] if a not in ('--verbose', '-v')]

    if not args:
        print("错误: 请指定路径")
        sys.exit(1)

    if args[0] == "--all":
        if len(args) < 2:
            print("错误: 请指定目录路径")
            sys.exit(1)
        validate_all_scripts(args[1], verbose)
    else:
        validate_single_script(args[0], verbose)


if __name__ == "__main__":
    main()
