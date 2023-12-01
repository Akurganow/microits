import { json2csv } from 'json-2-csv'

export function downloadFile(data: BlobPart, filename: string) {
	const blob = new Blob([data])
	const link = document.createElement('a')
	link.href = window.URL.createObjectURL(blob)
	link.setAttribute('download', filename)
	link.click()
}

export function downloadCSV(csv: string, filename: string) {
	const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
	downloadFile(csvData, `${filename}.csv`)
}

export function downloadArrayAsCSV(array: object[], filename: string) {
	const csvData = json2csv(array)
	downloadCSV(csvData, filename)
}
