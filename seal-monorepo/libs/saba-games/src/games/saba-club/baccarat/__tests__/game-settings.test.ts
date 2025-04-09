// Mock dependencies first
jest.mock('@sg/sg-game-client', () => ({
    getGameContainer: jest.fn((setting, siteConfigs, sharedContainer) => ({
        setting,
        siteConfigs,
        sharedContainer
    }))
}));

jest.mock('../../../../_shared/app-settings', () => ({
    getGameSetting: jest.fn(() => ({
        gameId: 'baccarat',
        gameName: 'Baccarat',
        gameType: 'table',
        gameVersion: '1.0.0'
    })),
    getSiteConfig: jest.fn(() => ({
        siteId: 'test-site',
        operatorId: 'test-operator',
        currency: 'USD'
    }))
}));

jest.mock('../../../../_shared/components/game-base/startup', () => ({
    sharedContainer: {
        gameId: 'shared',
        version: '1.0.0'
    }
}));

// Import after mocks are set up
import * as gc from "@sg/sg-game-client";
import { getGameSetting, getSiteConfig } from "../../../../_shared/app-settings";
import { sharedContainer } from "../../../../_shared/components/game-base/startup";
import { GameIds } from "../../../../_shared/constants";
import { setting, siteConfigs, containerOptions } from '../game-settings';

describe('game-settings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('setting', () => {
        it('should get game setting for Baccarat', () => {
            // Force re-import of the module to ensure mocks are used
            jest.isolateModules(() => {
                const { setting } = require('../game-settings');
                expect(getGameSetting).toHaveBeenCalledWith(GameIds.Baccarat);
                expect(setting).toEqual({
                    gameId: 'baccarat',
                    gameName: 'Baccarat',
                    gameType: 'table',
                    gameVersion: '1.0.0'
                });
            });
        });
    });

    describe('siteConfigs', () => {
        it('should get site config for Baccarat', () => {
            // Force re-import of the module to ensure mocks are used
            jest.isolateModules(() => {
                const { siteConfigs } = require('../game-settings');
                expect(getSiteConfig).toHaveBeenCalledWith(GameIds.Baccarat);
                expect(siteConfigs).toEqual({
                    siteId: 'test-site',
                    operatorId: 'test-operator',
                    currency: 'USD'
                });
            });
        });
    });

    describe('containerOptions', () => {
        it('should create container options with correct parameters', () => {
            // Force re-import of the module to ensure mocks are used
            jest.isolateModules(() => {
                const { setting, siteConfigs, containerOptions } = require('../game-settings');
                expect(gc.getGameContainer).toHaveBeenCalledWith(
                    setting,
                    siteConfigs,
                    sharedContainer
                );
                expect(containerOptions).toEqual({
                    setting: {
                        gameId: 'baccarat',
                        gameName: 'Baccarat',
                        gameType: 'table',
                        gameVersion: '1.0.0'
                    },
                    siteConfigs: {
                        siteId: 'test-site',
                        operatorId: 'test-operator',
                        currency: 'USD'
                    },
                    sharedContainer: {
                        gameId: 'shared',
                        version: '1.0.0'
                    }
                });
            });
        });
    });
}); 