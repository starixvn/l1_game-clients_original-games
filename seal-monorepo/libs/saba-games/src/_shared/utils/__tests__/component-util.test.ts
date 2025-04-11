import {
    gamePageMap,
    gameHeaderMap,
  } from '../component-util'; // Update the path accordingly
  
  import SieDiePage from '../../../games/saba-club/sedie/page';
  import VipSeDiePage from '../../../games/saba-club/vip-sedie/page';
  import BigSmallPage from '../../../games/saba-club/big-small/page';
  import BaccaratPage from '../../../games/saba-club/baccarat/page';
  
  import { SieDieHeader } from '../../../games/saba-club/sedie/header';
  import { VipSieDieHeader } from '../../../games/saba-club/vip-sedie/header';
  import { BigSmallHeader } from '../../../games/saba-club/big-small/header';
  import BaccaratHeader from '../../../games/saba-club/baccarat/header';
  
  import {
    SE_DIE_GAME_ID,
    SE_DIE_GAME_NAMESPACE,
    VIP_SE_DIE_GAME_ID,
    VIP_SE_DIE_GAME_NAMESPACE,
    UNBALANCED_BIG_SMALL_4_GAME_ID,
    UNBALANCED_BIG_SMALL_4_GAME_NAMESPACE,
    BACCARAT_GAME_ID,
    BACCARAT_GAME_NAMESPACE,
  } from '../../../../../saba-games/constant/app';
  
  describe('gamePageMap', () => {
    it('maps SE_DIE_GAME_ID to correct component and namespace', () => {
      expect(gamePageMap[SE_DIE_GAME_ID].component).toBe(SieDiePage);
      expect(gamePageMap[SE_DIE_GAME_ID].namespace).toBe(SE_DIE_GAME_NAMESPACE);
    });
  
    it('maps VIP_SE_DIE_GAME_ID to correct component and namespace', () => {
      expect(gamePageMap[VIP_SE_DIE_GAME_ID].component).toBe(VipSeDiePage);
      expect(gamePageMap[VIP_SE_DIE_GAME_ID].namespace).toBe(VIP_SE_DIE_GAME_NAMESPACE);
    });
  
    it('maps UNBALANCED_BIG_SMALL_4_GAME_ID to correct component and namespace', () => {
      expect(gamePageMap[UNBALANCED_BIG_SMALL_4_GAME_ID].component).toBe(BigSmallPage);
      expect(gamePageMap[UNBALANCED_BIG_SMALL_4_GAME_ID].namespace).toBe(UNBALANCED_BIG_SMALL_4_GAME_NAMESPACE);
    });
  
    it('maps BACCARAT_GAME_ID to correct component and namespace', () => {
      expect(gamePageMap[BACCARAT_GAME_ID].component).toBe(BaccaratPage);
      expect(gamePageMap[BACCARAT_GAME_ID].namespace).toBe(BACCARAT_GAME_NAMESPACE);
    });
  });
  
  describe('gameHeaderMap', () => {
    it('maps SE_DIE_GAME_ID to SieDieHeader', () => {
      expect(gameHeaderMap[SE_DIE_GAME_ID]).toBe(SieDieHeader);
    });
  
    it('maps VIP_SE_DIE_GAME_ID to VipSieDieHeader', () => {
      expect(gameHeaderMap[VIP_SE_DIE_GAME_ID]).toBe(VipSieDieHeader);
    });
  
    it('maps UNBALANCED_BIG_SMALL_4_GAME_ID to BigSmallHeader', () => {
      expect(gameHeaderMap[UNBALANCED_BIG_SMALL_4_GAME_ID]).toBe(BigSmallHeader);
    });
  
    it('maps BACCARAT_GAME_ID to BaccaratHeader', () => {
      expect(gameHeaderMap[BACCARAT_GAME_ID]).toBe(BaccaratHeader);
    });
  });
  