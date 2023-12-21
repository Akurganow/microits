import { getRandomItem } from 'lib/array'

describe('getRandomItem', () => {
	test('returns a random item from an array', () => {
		const array = [1, 2, 3, 4, 5]
		const randomItem = getRandomItem(array)
		expect(array).toContain(randomItem)
	})
})