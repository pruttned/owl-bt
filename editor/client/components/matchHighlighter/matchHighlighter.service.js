'use strict';

angular.module('editorApp')
  .service('MatchHighlighter',
    /**
     * Highlighter of fuzzy filter matching parts in a input string.
     */
    class MatchHighlighter {

      constructor(_){
        this._ = _;
      }

      _commitMatch(parts, isInMatch, buffer) {
        if (buffer.length > 0) {
          parts.push({
            text: buffer.join(''),
            isMatch: isInMatch
          });
        }
      }

      /**
       * Higlights matching filter parts in a input string
       * @param  {String} text - input string text whose content should be highlighted
       * @param  {String} filter - fuzzy filter
       * @return {part array} - matching and non matching parts (substrings) of the provided input string
       * @return {part}.text - text of the part
       * @return {part}.isMatch - whether the part represents a success match
       */
      getParts(text, filter) {
        filter = filter.toLowerCase();
        let indexInFilter = 0;
        let buffer = [];
        let isInMatch;
        let parts = [];
        for (let i = 0; i < text.length; i++) {
          let isMatchedChar = text[i].toLowerCase() === filter[indexInFilter];
          if (isMatchedChar) {
            indexInFilter++;
          }
          if (this._.isUndefined(isInMatch) || isMatchedChar !== isInMatch) {
            this._commitMatch(parts, isInMatch, buffer);
            isInMatch = isMatchedChar;
            buffer = [];
          }
          buffer.push(text[i]);
        }

        if(indexInFilter < filter.length){ //not whole filter was matched
          return [{
            text: text,
            isMatch: false
          }];
        }

        this._commitMatch(parts, isInMatch, buffer);

        return parts;
      }


    });
