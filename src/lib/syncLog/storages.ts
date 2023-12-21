import localForage from 'localforage'

export function createLogStorage(name: string) {
	return localForage.createInstance({
		name: `log-${name}`,
		storeName: `log-${name}`,
		version: 1,
		description: `Log of ${name} actions`,
	})
}
