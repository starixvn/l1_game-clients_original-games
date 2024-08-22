import getConfig from "next/config";

import AppSettings from "./type";

const getAppSettings: AppSettings = getConfig().publicRuntimeConfig;

export default getAppSettings;
