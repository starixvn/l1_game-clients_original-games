if (typeof window !== 'undefined' && window._ImageServerURL) {
  const publicPath = `${window._ImageServerURL}/Scripts/seal/seal-components-nx/`;
  __webpack_public_path__ = publicPath;
}

import VirtualSportRacing from '@virtualSport/index'; // 要轉 odds server 的用這個
import VirtualSport from '@virtualSportPush/index'; // 原本使用 push node 的用這個
import NumberGame from '@numberGame/index';
import SinglePage from '@SinglePage';
import InstantPlayDesktop from '@InstantPlayDesktop';
import InstantPlay from '@InstantPlay';
import SabaGamesGroup from '@SabaGamesGroup';
// TODO merge VGaming to Saba Games
import VGamingGroup from '@VGamingGroup';

// Original names
const SealComponents = {
  VirtualSport,
  VirtualSportRacing,
  NumberGame,
  SinglePage,
  InstantPlayDesktop,
  InstantPlay,
  SabaGamesGroup,
  VGamingGroup,
}

// Aliases for components to support renaming
const VirtualSportOddsServer = VirtualSportRacing;
const VirtualSportPushNode = VirtualSport;

export default {
  ...SealComponents,
  VirtualSportOddsServer, // New alias
  VirtualSportPushNode // New alias
};


// Export both original and alias names for flexibility
export {
  VirtualSport,
  VirtualSportRacing,
  NumberGame,
  SinglePage,
  InstantPlayDesktop,
  InstantPlay,
  SabaGamesGroup,
  VGamingGroup,
  VirtualSportOddsServer, // New alias
  VirtualSportPushNode // New alias
};
