'use strict';

angular.module('editorApp')
  .service('FuzzyFilter',
    /**
     * Fuzzy filter with result scoring
     */
    class FuzzyFilter {

      /**
       * Computes similarity score for each string in provided array against provided filter and filters out items that doesn't match the given filter
       * @param  {inputItem array} items - objects with strings to filter
       * @param  {String} inputItem.text - text that should be compared against the filter
       * @return {scoredItem Array} scoredItem - scored items with score > 0
       * @return {inputItem} scoredItem.item - provided input item
       * @return {float} scoredItem.score - score of the provided input text against the filter
       */
      filter(items, filter) {
        let results = items.map(function(item) {
          let score = item.text.score(filter);
          if (score <= 0) {
            return null;
          }
          return {
            item: item,
            score: score
          };
        });
        results = _.without(results, null);
        results.sort(function(a, b) {
          return b.score - a.score;
        });

        return results;
      }
    });
