declare global {
  interface Window {
    _ImageServerURL?: string;
  }
}

if (typeof window !== 'undefined' && window._ImageServerURL) {
  const publicPath = `${window._ImageServerURL}/Scripts/seal/seal-components-nx/`;
  // @ts-ignore
  __webpack_public_path__ = publicPath;
}

import SinglePage from '@/SinglePage';
import InstantPlayDesktop from '@/InstantPlayDesktop';
import InstantPlay from '@/InstantPlay';
import SabaGamesGroup from '@/SabaGamesGroup';
import VGamingGroup from '@/VGamingGroup';

// Original names
const SealComponents = {
  SinglePage,
  InstantPlayDesktop,
  InstantPlay,
  SabaGamesGroup,
  VGamingGroup,
}

export default SealComponents;

// Export components
export {
  SinglePage,
  InstantPlayDesktop,
  InstantPlay,
  SabaGamesGroup,
  VGamingGroup,
};
