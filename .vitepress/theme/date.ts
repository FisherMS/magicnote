/**
 * 标准化日期时间格式（YYYY-MM-DD HH:mm）
 * @param input 可接受 Date 对象或字符串
 * @returns 标准化后的日期时间字符串
 */
export function convertDateV2(input: Date | string): string {
    // 快速拦截非法类型或空输入
    if (!input || (typeof input !== 'string' && !(input instanceof Date))) {
        return ''
    }

    // 如果是 Date 实例，格式化为本地 "YYYY-MM-DD"
    if (input instanceof Date) {
        if (isNaN(input.getTime())) return ''
        const pad = (n: number) => n.toString().padStart(2, '0')
        return [input.getFullYear(), pad(input.getMonth() + 1), pad(input.getDate())].join('-')
    }

    const trimmed = input.trim()
    if (!trimmed) return ''

    // 如果是 ISO 字符串（如 "2025-05-01T12:30:00Z"），校验有效性并直接提取日期部分，避免本地时区偏移跨天
    if (trimmed.includes('T')) {
        if (isNaN(new Date(trimmed).getTime())) return ''
        return trimmed.split('T')[0]
    }

    // 校验输入字符串是否可以被正确解析为合法日期
    if (isNaN(new Date(trimmed).getTime())) {
        return ''
    }

    const parts = trimmed.split(/\s+/)
    const datePart = parts[0]

    // 仅有日期部分
    if (parts.length < 2 || parts[1].trim() === '') {
        return datePart
    }

    // 标准化时间格式为 HH:mm（只保留时和分，截断秒数）
    const timeComponents = parts[1]
        .split(':')
        .slice(0, 2)
        .map((component) => component.padStart(2, '0'))
    return `${datePart} ${timeComponents.join(':')}`
}

export function convertDate(date = new Date().toString()) {
    const json_date = new Date(date).toJSON()
    return json_date.split('T')[0]
}
