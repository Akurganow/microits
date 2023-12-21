import { ThemeConfig } from 'antd'

export const primaryColor = '#663399'
export const theme: ThemeConfig = {
	components: {
		Layout: {
			headerBg: '#fff',
			bodyBg: '#fff',
			headerHeight: 48,
		},
	},
	token: {
		colorPrimary: primaryColor,
		colorInfo: primaryColor,
		colorLink: primaryColor,
	}
}