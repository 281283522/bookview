#!/usr/bin/env python3
"""
检查小说章节字数的脚本

用法:
    # 检查单个章节
    python check_chapter_wordcount.py novels/小说名/第01章.md

    # 检查所有章节
    python check_chapter_wordcount.py --all novels/小说名/

    # 自定义最小字数
    python check_chapter_wordcount.py novels/小说名/第01章.md 3500
"""

import os
import sys
import re


def count_words(text):
    """统计文本中的中文字符数"""
    # 匹配中文字符
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)
    return len(chinese_chars)


def check_single_chapter(file_path, min_words=3000):
    """检查单个章节的字数"""
    if not os.path.exists(file_path):
        print(f"错误: 文件 {file_path} 不存在")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        word_count = count_words(content)
        print(f"章节 {file_path} 字数: {word_count}")
        
        if word_count < min_words:
            print(f"警告: 字数不足 {min_words}，建议扩充内容")
            return False
        else:
            print("字数符合要求")
            return True
    except Exception as e:
        print(f"错误: 读取文件时出错 - {e}")
        return False


def check_all_chapters(directory, min_words=3000):
    """检查目录中所有章节的字数"""
    if not os.path.exists(directory):
        print(f"错误: 目录 {directory} 不存在")
        return False
    
    chapter_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if re.match(r'第\d+章.*\.md$', file):
                chapter_files.append(os.path.join(root, file))
    
    if not chapter_files:
        print(f"错误: 目录 {directory} 中未找到章节文件")
        return False
    
    print(f"找到 {len(chapter_files)} 个章节文件")
    print("=" * 50)
    
    all_passed = True
    for file_path in sorted(chapter_files):
        print(f"检查: {os.path.basename(file_path)}")
        if not check_single_chapter(file_path, min_words):
            all_passed = False
        print("-" * 50)
    
    if all_passed:
        print("所有章节字数均符合要求")
    else:
        print("部分章节字数不足，需要扩充")
    
    return all_passed


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法:")
        print("  # 检查单个章节")
        print("  python check_chapter_wordcount.py novels/小说名/第01章.md")
        print("  ")
        print("  # 检查所有章节")
        print("  python check_chapter_wordcount.py --all novels/小说名/")
        print("  ")
        print("  # 自定义最小字数")
        print("  python check_chapter_wordcount.py novels/小说名/第01章.md 3500")
        sys.exit(1)
    
    if sys.argv[1] == "--all":
        if len(sys.argv) < 3:
            print("错误: 请指定目录路径")
            sys.exit(1)
        directory = sys.argv[2]
        min_words = 3000
        if len(sys.argv) > 3:
            try:
                min_words = int(sys.argv[3])
            except ValueError:
                print("错误: 最小字数必须是整数")
                sys.exit(1)
        check_all_chapters(directory, min_words)
    else:
        file_path = sys.argv[1]
        min_words = 3000
        if len(sys.argv) > 2:
            try:
                min_words = int(sys.argv[2])
            except ValueError:
                print("错误: 最小字数必须是整数")
                sys.exit(1)
        check_single_chapter(file_path, min_words)


if __name__ == "__main__":
    main()
