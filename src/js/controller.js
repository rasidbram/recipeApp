import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // 🔽🔽Includes polyfills for ECMAScript up to 2021 so EVERYTHING!! 🔽🔽
import 'regenerator-runtime/runtime'; // 🔽🔽 polyfills for async functions 🔽🔽
// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

// It enables the hot module replacement,
// which reloads the modules that changed without refreshing the whole website
// coming from PARCEl🔽🔽
// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();

		// Update results view to mark selected search result
		resultsView.update(model.getSearchResultPage());

		// Updating bookmarks view
		bookmarksView.update(model.state.bookmarks);

		// Loading recipe 🟢
		await model.loadRecipe(id);

		// Rendering recipe 🟢
		recipeView.render(model.state.recipe);
	} catch (error) {
		recipeView.renderError();
	}
};

// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();
		// 1) get search query 🟢
		const query = searchView.getQuery();
		if (!query) return;
		// 2) load search results 🟢
		await model.loadSearchResults(query);
		// 3) Rendering recipe 🟢
		// resultsView.render(model.state.search.results) for all;
		resultsView.render(model.getSearchResultPage());
		// 4) Render inital pagination buttons
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
};

// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const controlPagination = function (goToPage) {
	// 3) Rendering NEW Result 🟢
	resultsView.render(model.getSearchResultPage(goToPage));
	// 4) Render NEW pagination buttons
	paginationView.render(model.state.search);
};

// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const controlServings = function (newServings) {
	// update recipe servings(in state)
	model.updateServings(newServings);
	// Update recipe view
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const controlAddBookmark = function () {
	// add-remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// update bookmarks
	recipeView.update(model.state.recipe);

	// render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};
// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const controlAddRecipe = async function (newRecipe) {
	try {
		//spinner
		addRecipeView.renderSpinner();
		//upload new recipe data
		await model.uploadRecipe(newRecipe);
		//render recipe
		recipeView.render(model.state.recipe);
		//success message
		addRecipeView.renderMessage();
		//render bookmark views
		bookmarksView.render(model.state.bookmarks);
		//change Id inn url
		window.history.pushState(null, '', `#${model.state.recipe.id}`);
		// close form
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (error) {
		console.log(error);
		addRecipeView.renderError(error.message);
	}
};
// --------  ----------  -----------  -----------  -----------  ----------  -----------  ----------

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandleRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
