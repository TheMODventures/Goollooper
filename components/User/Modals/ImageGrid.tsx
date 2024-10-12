import { IMAGE_URL } from "@/lib/constants";
import Image from "next/image";

const ImageGrid = ({ images, alt }: { images: string[]; alt: string }) => (
  <div className="flex flex-wrap gap-3">
    {images.map((image: string) => (
      <Image
        key={image}
        src={`${IMAGE_URL}${image}`}
        alt={alt}
        width={150}
        height={150}
        className="rounded-2xl"
      />
    ))}
  </div>
);

export default ImageGrid;
