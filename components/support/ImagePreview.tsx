import { X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const ImagePreview = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => {
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });

      fitImageToContainer(img.naturalWidth, img.naturalHeight);

    };
    img.src = src;
  }, [src]);


  const fitImageToContainer = (imgWidth: number, imgHeight: number) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const containerAspectRatio = containerWidth / containerHeight;
      const imageAspectRatio = imgWidth / imgHeight;

      let newScale;
      if (imageAspectRatio > containerAspectRatio) {
        newScale = containerWidth / imgWidth;
      } else {
        newScale = containerHeight / imgHeight;
      }

      newScale *= 0.9;

      setScale(newScale);
      setPosition({ x: 0, y: 0 });
    }
  };


  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
        >
          <X size={24} />
        </button>
        <button
          onClick={handleZoomIn}
          className="absolute bottom-4 right-16 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
        >
          <ZoomIn size={24} />
        </button>
        <button
          onClick={handleZoomOut}
          className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
        >
          <ZoomOut size={24} />
        </button>
        <div
          className="cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          <Image
            ref={imageRef}
            src={src}
            alt="Preview"

            width={imageSize.width}
            height={imageSize.height}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: 'none',
              maxHeight: 'none',

            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;