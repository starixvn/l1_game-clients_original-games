import { sound } from '@pixi/sound';

export type dimensionType = {
    width: number;
    height: number;
};

export type game_global_vars_type = {
    curPayout: number;
    allowedBet: boolean;
    id: number[];
    hash: string;
    betValue: string[];
    betPlaceStatus: betPlaceStatusType[];
    cashingStatus: cashingStatusType[];
    cashStarted: boolean[];
    pendingBet: boolean[];
    autoCashVal: string[];
    enabledAutoCashOut: boolean[];
    stake: {
        max: number;
        min: number;
    };
};

export type betPlaceStatusType = "none" | "placing" | "success" | "failed";
export type cashingStatusType = "none" | "caching" | "success" | "failed";

export const Game_Global_Vars: game_global_vars_type = {
    curPayout: 0,
    allowedBet: false,
    id: [0, 0],
    hash: "",
    betValue: ["100", "100"],
    betPlaceStatus: ["none", "none"],
    cashingStatus: ["none", "none"],
    cashStarted: [false, false],
    pendingBet: [false, false],
    autoCashVal: ["1.45", "1.45"],
    enabledAutoCashOut: [false, false],
    stake: {
        max: 10000,
        min: 100
    },
};

export const initBet6 = ["100", "500", "1000", "5000", "10000", "50000"];

export function doDelay(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec));
}

export function getHistoryItemColor(_val: string) {
    const val = parseFloat(_val.substring(0, _val.length - 1));
    if (val < 2) return "#07BDE5";
    else if (val < 10) return "#913EF8";
    else return "#C017B4";
}

export function showToast(msg: string, type: "error" | "info" = "error") {
    // You can implement your toast logic here or use a library
    alert(`${type.toUpperCase()}: ${msg}`);
}

export function loadSound() {
    const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/";
    sound.add('bg-sound', `${assetsUrl}general/sound/bg-sound.mp3`);
    sound.add('flew-sound', `${assetsUrl}general/sound/flew.mp3`);
    sound.add('win-sound', `${assetsUrl}general/sound/win.mp3`);
    sound.add('take-sound', `${assetsUrl}general/sound/take.mp3`);
    sound.volumeAll = 0.5;
}

export const webpORpng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, 1, 1);
        const dataURL = canvas.toDataURL('image/webp');
        return dataURL.indexOf('data:image/webp') === 0 ? 'webp' : 'png';
    }
    return 'png';
};

export { }; 