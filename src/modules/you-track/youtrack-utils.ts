import { serverEnv } from "@/env/server-env";

// TODO INLINE
export const getYouTrackAvatarBaseUrl = () => {
  const baseUrl = serverEnv.youtrackApiEndpoint;
  // remove last trailing slash from the base url
  return baseUrl[baseUrl.length - 1] === "/" ? baseUrl.slice(0, -1) : baseUrl;
};
// TODO INLINE
export const prefixWithYouTrackAvatarBaseUrl = (path: string) => {
  return `${getYouTrackAvatarBaseUrl()}${path}`;
};

export const youTrackUtils = {
  prefixWithYouTrackAvatarBaseUrl,
  getYouTrackAvatarBaseUrl,
};
