'use client';

import { useEffect, useRef } from 'react';

export default function VideoSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % slider.children.length;
        slider.scrollTo({
          left: (slider.children[index] as HTMLElement).offsetLeft,
          behavior: 'smooth',
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div
      className="flex h-full w-full snap-x snap-mandatory overflow-hidden m-0 p-0"
      style={{ scrollBehavior: 'smooth' }}
      ref={sliderRef}
    >
      <video
        className="h-full w-full flex-shrink-0 object-cover snap-center"
        src="/videos/video_pasta.mp4"
        autoPlay
        loop
        muted
      ></video>
      <video
        className="h-full w-full flex-shrink-0 object-cover snap-center"
        src="/videos/video_pizza.mp4"
        autoPlay
        loop
        muted
      ></video>
      <video
        className="h-full w-full flex-shrink-0 object-cover snap-center"
        src="/videos/video_round.mp4"
        autoPlay
        loop
        muted
      ></video>
    </div>
  );
}