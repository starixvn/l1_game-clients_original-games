import { webpORpng } from "./index";

export const urls = [
    `${process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/"}${webpORpng()}/plane-anim.json`,
    `${process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/"}${webpORpng()}/parachute-red-anim.json`,
    `${process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/"}${webpORpng()}/parachute-gray-anim.json`,
    `${process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/"}${webpORpng()}/sun-like-bg.${webpORpng()}`,
    `${process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/"}${webpORpng()}/propeller.${webpORpng()}`,
    `${process.env.NEXT_PUBLIC_ASSETS_IMAGE_URL || "https://assets.bollygaming.games/"}${webpORpng()}/dot.${webpORpng()}`,
]; 