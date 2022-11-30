export function searchParse(search, searchpage = true) {
	let output = {
		raw: search
	};
 
	if (searchpage) {
        output.page = 1;
		const pageRegex = /[\?&]page=(?<pageNumber>[1-9][0-7]*)/gm;
		for (const match of search.matchAll(pageRegex)) {
			output.page = parseInt(match.groups.pageNumber);
		}
	}
	const categoriesRegex = /[\?&]categories=(?<category>\w*)/gm;
	if (search.match(categoriesRegex) !== null) {
		output.categories = [];
	}
	for (const match of search.matchAll(categoriesRegex)) {
		output.categories.push(match.groups.category);
	}
 
	const vegetarianRegex = /[\?&]vegetarian=(?<vegetarian>\w*)/gm;
	for (const match of search.matchAll(vegetarianRegex)) {
		output.vegetarian = match.groups.vegetarian;
	}
 
	const sortingRegex = /[\?&]sorting=(?<sorting>\w*)/gm;
	for (const match of search.matchAll(sortingRegex)) {
		output.sorting = match.groups.sorting;
	}
	return output;
}