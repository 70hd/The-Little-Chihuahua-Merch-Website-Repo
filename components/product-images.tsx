import Image from 'next/image'
import React, { useState } from 'react'

// Define types for the image object and the props
interface ImageOption {
  image: string;
  alt: string;
}

interface ProductImagesProps {
  imageOptions: ImageOption[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ imageOptions }) => {
  // Ensure currentImage state is properly typed
  const [currentImage, setCurrentImage] = useState<ImageOption>({
    image: imageOptions[0]?.image || '',
    alt: imageOptions[0]?.alt || ''
  });

  // Filter out the selected image
  const filteredImages = imageOptions.filter((img) => img.image !== currentImage.image);

  return (
    <div className="w-full flex min-h-full">
      {/* Image thumbnail selection */}
      <div className="p-3 bg-[#221E1F]/10 flex flex-col gap-3">
        {filteredImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage({ image: img.image, alt: img.alt })}
            aria-label={`Select image: ${img.alt}`} // Improved accessibility
            className="focus:outline-none focus:ring-2 focus:ring-blue-500" // Focus styling for keyboard navigation
          >
            <Image
              src={img.image}
              width={96}
              height={157}
              alt={img.alt}
              className="w-[120px] h-full"
              loading="lazy" // Improve performance by deferring off-screen images
            />
          </button>
        ))}
      </div>

      {/* Main image display */}
      <div className="relative flex-1 h-full">
        <Image
          src={currentImage.image}
          alt={currentImage.alt}
          fill
          className="h-full"
          loading="lazy" // Lazy load the main image
        />
      </div>
    </div>
  );
};

export default ProductImages;