export default {
	fetch() {
		const lookupTable = {
			0: 'https://www.os3.nl',
			1: 'https://www.delaat.net',
			2: 'https://github.com',
			3: 'https://nu.nl',
		  };
		  const id = Math.floor(Math.random() * Object.keys(lookupTable).length) // randomly select an URL
		  const url = new URL(lookupTable[id])
		  return fetch(url.toString())
		}
	}
