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