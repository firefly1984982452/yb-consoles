
// 适配分辨率的echarts-一般字体
export const getAdapterFont = () => {
    let wid = window.screen.width
    if (wid < 1300) {
        return 10
    } else {
        return 13
    }
}

// 适配分辨率的echarts-粗字体
export const getAdapterFontBold = () => {
    let wid = window.screen.width
    if (wid < 1300) {
        return 18
    } else {
        return 22
    }
}