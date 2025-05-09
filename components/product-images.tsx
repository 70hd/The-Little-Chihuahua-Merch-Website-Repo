import { CldImage } from "next-cloudinary";

import React, { useEffect, useState } from "react";

interface ImageOption {
  id: number;
  image: string;
  alt: string;
}

interface ProductImagesProps {
  imageOptions: ImageOption[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ imageOptions }) => {
  const [currentImage, setCurrentImage] = useState<ImageOption>({
    id: 0,
    image: "",
    alt: "",
  });
  const filteredImages = imageOptions?.filter((img) => img.image);

  useEffect(() => {
    if (
      filteredImages &&
      filteredImages.length > 0 &&
      currentImage.image === ""
    ) {
      setCurrentImage({
        id: filteredImages[0].id,
        image: filteredImages[0].image,
        alt: filteredImages[0].alt,
      });
    }
  }, [filteredImages, currentImage.image]);

  if (!filteredImages) {
    return;
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <div className="relative aspect-square w-full flex items-center justify-center">
        {currentImage.image ? (
          <CldImage
            src={currentImage.image}
            alt={currentImage.alt}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className=" relative w-full aspect-square loader" />
        )}
      </div>

      <div className="p-3 bg-[#221E1F]/10 grid grid-flow-col auto-cols-fr gap-3">
        {filteredImages?.map((img, index) =>
          !img.image ? (
            <div className=" relative w-full aspect-square loader" />
          ) : (
            <button
              key={index}
              onClick={() =>
                setCurrentImage({ id: index, image: img.image, alt: img.alt })
              }
              aria-label={`Select image: ${img.alt}`}
              className="relative w-full aspect-square focus:outline-none focus:ring-2 focus:ring-blue-500" 
            >
              <CldImage
                src={img.image}
                alt={img.alt}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductImages;
