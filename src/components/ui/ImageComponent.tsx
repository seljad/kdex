import Image, { ImageProps } from "next/image";

function ImageComponent({ src, alt, className, style, ...rest }: ImageProps) {
  return (
    <Image src={src} alt={alt} className={className} style={style} {...rest}/>
  );
}

export default ImageComponent;