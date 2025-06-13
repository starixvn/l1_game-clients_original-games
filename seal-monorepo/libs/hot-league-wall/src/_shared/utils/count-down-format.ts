/**
 * 將秒數轉換為 MM:SS 格式
 * @param seconds 總秒數
 * @returns 格式化後的時間字符串 (MM:SS)
 */
export const formatSecondsToTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 將秒數轉換為純秒數格式
 * @param seconds 總秒數
 * @returns 格式化後的秒數字符串
 */
export const formatSecondsOnly = (seconds: number): string => {
    return seconds.toString().padStart(2, '0');
}; 