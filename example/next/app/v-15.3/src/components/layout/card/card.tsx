import { CheckerProps } from "@/shared/types/object";
import Image, { StaticImageData } from "next/image";
import { CSSProperties } from "react";

interface Props {
    title: string;
    src: StaticImageData | string;
    alt: string;
    boxHeight: number;
    srcWidth: number;
    srcHeight: number;
}

export function Card<T extends Props>(
    props: CheckerProps<T, Props, "different card props">
) {
    const { title, src, alt, srcWidth, srcHeight, boxHeight } = props;

    const cardStyle: CSSProperties = {
        width: srcWidth,
        height: boxHeight,
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        margin: "1rem"
    };

    const imageStyle: CSSProperties = {
        objectFit: "cover"
    };

    const nameStyle: CSSProperties = {
        padding: "1rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#333",
        margin: 0
    };

    return (
        <div style={cardStyle}>
            <Image
                src={src}
                alt={alt}
                style={imageStyle}
                width={srcWidth}
                height={srcHeight}
            />
            <p style={nameStyle}>{title}</p>
        </div>
    );
}
