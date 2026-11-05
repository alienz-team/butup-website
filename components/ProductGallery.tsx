"use client";

import { useState } from "react";

/** Main photo (3:4) with a row of thumbnails; the active one gets the magenta border. */
export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div
        role="img"
        aria-label={title}
        className="w-full rounded bg-cover bg-center"
        style={{ backgroundImage: `url(${images[i]})`, paddingBottom: "133.3333%" }}
      />
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((src, n) => (
            <button
              key={src}
              type="button"
              aria-label={`${title} ${n + 1}`}
              aria-pressed={n === i}
              onClick={() => setI(n)}
              className={`block rounded bg-cover bg-center ${n === i ? "outline outline-2 outline-accent" : ""}`}
              style={{ backgroundImage: `url(${src})`, paddingBottom: "133.3333%" }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
