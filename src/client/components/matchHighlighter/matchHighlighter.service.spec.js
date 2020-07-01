'use strict';

describe('Service: MatchHighlighter', function () {

  // load the service's module
  beforeEach(() => angular.mock.module('editorApp'));

  // instantiate service
  let MatchHighlighter;
  beforeEach(() => inject(function (_MatchHighlighter_) {
    MatchHighlighter = _MatchHighlighter_;
  }));

  it('each filter character must be present in matching parts only once and in correct order', function () {
    let input = 'droand roe da medameda';

    let res = MatchHighlighter.getParts(input, 'andromeda');
    expect(res.length).toBe(7);

    expect(res[0].text).toBe('dro');
    expect(res[0].isMatch).toBe(false);

    expect(res[1].text).toBe('and');
    expect(res[1].isMatch).toBe(true);

    expect(res[2].text).toBe(' ');
    expect(res[2].isMatch).toBe(false);

    expect(res[3].text).toBe('ro');
    expect(res[3].isMatch).toBe(true);

    expect(res[4].text).toBe('e da ');
    expect(res[4].isMatch).toBe(false);

    expect(res[5].text).toBe('meda');
    expect(res[5].isMatch).toBe(true);

    expect(res[6].text).toBe('meda');
    expect(res[6].isMatch).toBe(false);
  });

  it('single unmatched part must be returned for filter that is not wholly present in the input string', function () {
    let input = 'droand roe da medameda';

    let res = MatchHighlighter.getParts(input, 'andromeda car');
    expect(res.length).toBe(1);

    expect(res[0].text).toBe(input);
    expect(res[0].isMatch).toBe(false);
  });

  it('exact match must return only one part', function () {
    let input = 'andromeda';

    let res = MatchHighlighter.getParts(input, 'andromeda');
    expect(res.length).toBe(1);

    expect(res[0].text).toBe('andromeda');
    expect(res[0].isMatch).toBe(true);
  });
});
