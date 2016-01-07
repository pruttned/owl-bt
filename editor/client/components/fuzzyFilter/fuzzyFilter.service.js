'use strict';

angular.module('editorApp')
  .service('FuzzyFilter',
    /**
     * Fuzzy filter with result scoring
     */
    class FuzzyFilter {

      /**
       * Computes similarity score for each string in provided array against provided filter and filters out items that doesn't match the given filter
       * @param  {String array} items - strings to filter
       * @return {scoredItem array} - scored items with score > 0
       * @return {scoredItem}.text - provided input text
       * @return {scoredItem}.score - score of the provided input text against the filter
       */
      filter(items, filter) {
        let results = items.map(function(item) {
          let score = item.score(filter);
          if (score <= 0) {
            return null;
          }
          return {
            text: item,
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
