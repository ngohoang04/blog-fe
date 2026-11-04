import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';

const defaults = { hero: '/images/editorial-hanoi-street.jpg', profile: '/images/editorial-hanoi-cafe.jpg' };
// The original settings contained unrelated game maps. Leave those records intact;
// use the approved photographs until an editor saves a replacement in Homepage Images.
const legacyImages = new Set([
  'https://res.cloudinary.com/d36z15vh/image/upload/v1787789505/vietnam-decoded/tnxs6fuiz5nkgn0loy1v.jpg',
  'https://res.cloudinary.com/d36z15vh/image/upload/v1787789532/vietnam-decoded/gwx2ahbq2lyjov1ofxbz.jpg',
]);
const ImageContext = createContext(defaults);
export function SiteImages({ children }) {
  const [images, setImages] = useState(defaults);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const controller = new AbortController();
    api.get('/settings', { signal: controller.signal }).then(({ data }) => {
      const next = { ...defaults };
      for (const kind of ['hero', 'profile']) {
        const value = data[`${kind}Image`];
        if (value && !legacyImages.has(value)) next[kind] = value;
      }
      setImages(next);
    }).catch(() => {});
    return () => controller.abort();
  }, [pathname]);
  return <ImageContext.Provider value={images}>{children}</ImageContext.Provider>;
}
export function EditorialImage({ kind, ...props }) {
  const images = useContext(ImageContext);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [images[kind]]);
  const customProfile = kind === 'profile' && images.profile !== defaults.profile && !failed;
  return <img {...props} src={failed ? defaults[kind] : images[kind]}
    alt={customProfile ? 'Ngô Thị Cúc' : props.alt}
    onError={() => setFailed(true)} />;
}

export function EditorialImageCredit() {
  const images = useContext(ImageContext);
  return images.profile === defaults.profile ? <figcaption>Hanoi, Vietnam · Photograph by Hieu Tran / Unsplash</figcaption> : null;
}
