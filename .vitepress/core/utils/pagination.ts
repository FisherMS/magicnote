/**
 * 博客分页计算工具函数
 */

export function generatePaginationArray(
    pagesNum: number,
    currentPage: number,
    maxItems: number = 11
): (number | string)[] {
    pagesNum = Math.max(1, pagesNum)
    currentPage = Math.min(Math.max(currentPage, 1), pagesNum)

    const result: (number | string)[] = []

    if (pagesNum <= maxItems) {
        // 小于最大显示数量，全显示
        for (let i = 1; i <= pagesNum; i++) {
            result.push(i)
        }
        return result
    }

    const sideCount = 2 // 左右边界固定显示的页数（如 1,2 和 pagesNum-1, pagesNum）
    const middleCount = maxItems - (sideCount * 2 + 2) // 中间可用数字数量（减去两端和两个省略号）
    const half = Math.floor(middleCount / 2)

    const pages = new Set<number>()

    // 始终显示前两个和最后两个
    for (let i = 1; i <= sideCount; i++) {
        pages.add(i)
        pages.add(pagesNum - i + 1)
    }

    // 当前页靠前
    if (currentPage <= sideCount + half + 1) {
        for (let i = sideCount + 1; i <= sideCount + middleCount + 1; i++) {
            if (i < pagesNum - sideCount + 1) pages.add(i)
        }
    }
    // 当前页靠后
    else if (currentPage >= pagesNum - sideCount - half) {
        for (let i = pagesNum - sideCount - middleCount; i < pagesNum - sideCount + 1; i++) {
            if (i > sideCount) pages.add(i)
        }
    }
    // 当前页在中间
    else {
        for (let i = currentPage - half; i <= currentPage + half; i++) {
            if (i > sideCount && i < pagesNum - sideCount + 1) pages.add(i)
        }
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b)

    // 插入省略号
    let prev = 0
    for (const page of sortedPages) {
        if (page - prev > 1) {
            result.push('...')
        }
        result.push(page)
        prev = page
    }

    return result
}
