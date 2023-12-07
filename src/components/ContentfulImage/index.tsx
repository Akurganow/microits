import { ComponentProps, useMemo } from 'react'
import { Image } from 'antd'

interface ContentfulImageProps extends Omit<ComponentProps<typeof Image>, 'src'> {
    src: string
    format?: 'webp' | 'jpg' | 'png' | 'gif' | 'avif'
    png8?: boolean
    progressive?: boolean
    quality?: number
    width?: number
    height?: number
    radius?: number
    fit?: 'fill' | 'scale' | 'crop' | 'thumb' | 'pad'
    focus?: 'top' | 'right' | 'bottom' | 'left' | 'face' | 'faces' | 'center' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right'
    background?: string
}

const DEFAULT_FORMAT = 'webp'
const DEFAULT_QUALITY = 75
const DEFAULT_PROGRESSIVE = true

function getImageUrl(imageProps: ContentfulImageProps) {
	console.log('getImageUrl', imageProps)
	const protocol = window.location.protocol
	const url = new URL(protocol + imageProps.src)
	const params = new URLSearchParams(url.search)

	if (imageProps.format) params.set('fm', imageProps.format)
	if (imageProps.png8 && imageProps.format === 'png') params.set('fl', 'png8')
	if (imageProps.progressive && imageProps.format === 'jpg') params.set('fl', imageProps.progressive ? 'progressive' : '')
	if (imageProps.quality) params.set('q', String(imageProps.quality))
	if (imageProps.width) params.set('w', String(imageProps.width))
	if (imageProps.height) params.set('h', String(imageProps.height))
	if (imageProps.radius) params.set('r', String(imageProps.radius))
	if (imageProps.fit) params.set('fit', imageProps.fit)
	if (imageProps.focus) params.set('f', imageProps.focus)
	if (imageProps.background) params.set('bg', imageProps.background)

	return `${url.origin}${url.pathname}?${params.toString()}`
}

export default function ContentfulImage({
	src,
	alt = '',
	format = DEFAULT_FORMAT,
	quality = DEFAULT_QUALITY,
	progressive = DEFAULT_PROGRESSIVE,
	png8,
	width,
	height,
	radius,
	fit,
	focus,
	background,
	...props
}: ContentfulImageProps) {
	const source = useMemo(() => getImageUrl({
		src,
		format,
		quality,
		progressive,
		png8,
		width,
		height,
		radius,
		fit,
		focus,
		background,
	}), [src, format, quality, progressive, png8, width, height, radius, fit, focus, background])
	const sourceSet = useMemo(() => getImageUrl({
		src,
		format,
		quality,
		progressive,
		png8,
		width: width ? width * 2 : undefined,
		height: height ? height * 2 : undefined,
		radius,
		fit,
		focus,
		background,
	}), [src, format, quality, progressive, png8, width, height, radius, fit, focus, background])

	return src ? <Image
		{...props}
		width={width}
		height={height}
		alt={alt}
		src={source}
		srcSet={width || height ? sourceSet : undefined}
	/> : null
}