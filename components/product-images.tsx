import Image from 'next/image'
import React, {useState } from 'react'

const ProductImages = ({ imageOptions }) => {
  const [currentImage, setCurrentImage] = useState({
    image: imageOptions?.[0]?.image || '',
    imageAlt: imageOptions?.[0]?.alt || ''
  });

  const filteredImages = imageOptions.filter((img) => img.image !== currentImage.image);

  return (
    <div className='w-full flex min-h-full '>
      <div className='p-3 bg-[#221E1F]/10 flex flex-col gap-3'>
        {filteredImages.map((img, index) => (
          <button key={index} onClick={() => setCurrentImage({ image: img.image, imageAlt: img.alt })}>
            <Image src={img.image} width={96} height={157} alt={img.alt} className='w-[120px] h-full ' />
          </button>
        ))}
      </div>
  <div className="relative flex-1 h-full"> 
    <Image
      src={currentImage.image}
      alt={currentImage.imageAlt}
      fill
      className="h-full"
    />
  </div>
    </div>
  );
};

export default ProductImages;