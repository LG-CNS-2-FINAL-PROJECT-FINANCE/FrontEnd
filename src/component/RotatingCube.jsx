import React from "react";

/**
 * Rotating 3D Image Cube (pure CSS3D)
 *
 * Usage:
 *   <ImageCube
 *     images={{
 *       front: "/img/front.jpg",
 *       back: "/img/back.jpg",
 *       right: "/img/right.jpg",
 *       left: "/img/left.jpg",
 *       top: "/img/top.jpg",
 *       bottom: "/img/bottom.jpg",
 *     }}
 *     size={260}   // optional, px
 *     speed={12}   // optional, seconds per full rotation
 *   />
 */
export default function ImageCube({
  images = {},
  size = 240,
  speed = 10,
}) {
  const half = size / 2;

  const faceBase = {
    position: "absolute",
    width: size + "px",
    height: size + "px",
    backfaceVisibility: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  };

  const faces = {
    front: {
      ...faceBase,
      transform: `translateZ(${half}px)`,
      backgroundImage: images.front ? `url(${images.front})` : undefined,
      backgroundColor: "#111827",
    },
    back: {
      ...faceBase,
      transform: `rotateY(180deg) translateZ(${half}px)`,
      backgroundImage: images.back ? `url(${images.back})` : undefined,
      backgroundColor: "#111827",
    },
    right: {
      ...faceBase,
      transform: `rotateY(90deg) translateZ(${half}px)`,
      backgroundImage: images.right ? `url(${images.right})` : undefined,
      backgroundColor: "#111827",
    },
    left: {
      ...faceBase,
      transform: `rotateY(-90deg) translateZ(${half}px)`,
      backgroundImage: images.left ? `url(${images.left})` : undefined,
      backgroundColor: "#111827",
    },
    top: {
      ...faceBase,
      transform: `rotateX(90deg) translateZ(${half}px)`,
      backgroundImage: images.top ? `url(${images.top})` : undefined,
      backgroundColor: "#111827",
    },
    bottom: {
      ...faceBase,
      transform: `rotateX(-90deg) translateZ(${half}px)`,
      backgroundImage: images.bottom ? `url(${images.bottom})` : undefined,
      backgroundColor: "#111827",
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Rotating Image Cube</h1>

      {/* Stage with perspective */}
      <div
        className="relative"
        style={{ perspective: `${size * 6}px` }}
      >
        {/* Cube wrapper */}
        <div
          className="cube group"
          style={{
            position: "relative",
            width: size + "px",
            height: size + "px",
            transformStyle: "preserve-3d",
            animation: `spin ${speed}s linear infinite`,
          }}
        >
          <div style={faces.front} />
          <div style={faces.back} />
          <div style={faces.right} />
          <div style={faces.left} />
          <div style={faces.top} />
          <div style={faces.bottom} />
        </div>
      </div>


      {/* Inline keyframes & hover behavior */}
      <style>{`
        .cube:hover { animation-play-state: paused; }
        @keyframes spin {
          0%   { transform: rotateX(-10deg) rotateY(0deg); }
          50%  { transform: rotateX( 10deg) rotateY(180deg); }
          100% { transform: rotateX(-10deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}