'use client'
import {
	AudioTwoTone,
	BugTwoTone,
	BulbTwoTone,
	CompassTwoTone,
	ExperimentTwoTone,
	FireTwoTone,
	FrownTwoTone,
	GiftTwoTone,
	HeartTwoTone,
	MehTwoTone,
	PictureTwoTone,
	PieChartTwoTone,
	PlayCircleTwoTone,
	QuestionCircleTwoTone,
	RocketTwoTone,
	SmileTwoTone,
	ThunderboltTwoTone,
	ToolTwoTone,
	VideoCameraTwoTone,
	WalletTwoTone
} from '@ant-design/icons'
import { ComponentProps } from 'react'

const icons = {
	play: PlayCircleTwoTone,
	question: QuestionCircleTwoTone,
	piechart: PieChartTwoTone,
	mic: AudioTwoTone,
	bug: BugTwoTone,
	bulb: BulbTwoTone,
	compass: CompassTwoTone,
	experiment: ExperimentTwoTone,
	fire: FireTwoTone,
	gift: GiftTwoTone,
	heart: HeartTwoTone,
	frown: FrownTwoTone,
	meh: MehTwoTone,
	smile: SmileTwoTone,
	picture: PictureTwoTone,
	rocket: RocketTwoTone,
	thunderbolt: ThunderboltTwoTone,
	tool: ToolTwoTone,
	video: VideoCameraTwoTone,
	wallet: WalletTwoTone,
}

interface IconProps extends ComponentProps<typeof AudioTwoTone> {
	name?: string
}

export default function PostIcon({ name, ...props }: IconProps) {
	const Icon = name ? icons[name] : undefined
    
	return Icon ? <Icon {...props} /> : null
}