import React, { useState } from 'react'
import fallbackImg from "../../assets/img/fallback-image.png";

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // Treat missing/empty src as an error so we render the fallback UI.
  const isMissingSrc = src === undefined || src === null || String(src).trim() === "";

  if (didError || isMissingSrc) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={fallbackImg} alt={alt ?? 'image not available'} className={className} style={style} />
        </div>
      </div>
    );
  }

  return <img src={String(src)} alt={alt} className={className} style={style} {...rest} onError={handleError} />;
}
