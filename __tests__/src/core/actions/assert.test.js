const uuid = require('uuid/v4');
const { when } = require('jest-when');
const assert = require('../../../../src/core/actions/assert').common;
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { buildRegexFromParamString } = require('../../../../src/utils/buildRegex');
const { eraseHighlights } = require('../../../../src/utils/browser/eraser');
const { checkElementAvailability } = require('../../../../src/core/actions/assert');

const sampleResp = require('../../../__mocks__/sampleResp.json');
const { ASSERTION, MESSAGE_TYPE } = require('../../../../src/constants');

describe('assert action test suite', () => {
  test('assert command should emit an information message with text "True" if the "equals" assertion is true', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, expectedVal: valueInStore } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "equals" assertion is false', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, expectedVal: uuid() } }); // expecting for another value other than the the valueInStore
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "not equals" assertion is true', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = 'abc';

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, notExpectedVal: uuid() } }); // expecting a random uuid not to be equal to the string 'abc'
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "not equals" assertion is false', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, notExpectedVal: valueInStore } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "equals" assertion is true in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(valueInStore);
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKeyOne, expectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "equals" assertion is false in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(uuid());
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(uuid());

    await assert({ args: { actualVal: storeKeyOne, expectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "not equals" assertion is true in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(uuid());
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(uuid());

    await assert({ args: { actualVal: storeKeyOne, notExpectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "not equals" assertion is false in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(valueInStore);
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKeyOne, notExpectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "equals" assertion is true when an object property is accessed', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: "$donut['batters']['batter][1]['type]", expectedVal: 'Chocolate' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "equals" assertion is false or object property is unavailable when accessing object properties', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: '$donut[\'batters\'][\'batter\'][1][\'type]', expectedVal: 'Blueberry' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "not equals" assertion is true when accessing object properties', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: '$donut[\'batters\'][\'batter\'][1][\'type]', notExpectedVal: 'Blueberry' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "not equals" assertion is false when accessing object properties', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: '$donut[\'batters\'][\'batter\'][1][\'type]', notExpectedVal: 'Chocolate' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "TRUE" if the "is available" assertion is true when accessing object properties', async () => {
    const element = {
      isDisplayed: jest.fn().mockResolvedValue(true),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const selector = uuid();
    const parsedSelector = buildRegexFromParamString(selector);
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    logger.emitLogs = jest.fn();

    await checkElementAvailability(
      state,
      {
        isAvailable: true,
      },
      {
        args: {
          selector,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      undefined,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.PASS,
      type: MESSAGE_TYPE.INFO,
    });
  });

  test('assert command should emit an information message with text "TRUE" if the "is not available" assertion is true when accessing object properties', async () => {
    const element = {
      isDisplayed: jest.fn().mockResolvedValue(false),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const selector = uuid();
    const parsedSelector = buildRegexFromParamString(selector);
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    logger.emitLogs = jest.fn();

    await checkElementAvailability(
      state,
      {
        isAvailable: false,
      },
      {
        args: {
          selector,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      undefined,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.PASS,
      type: MESSAGE_TYPE.INFO,
    });
  });

  test('assert command should emit an information message with text "TRUE" if the "is available" assertion is true when accessing object properties near marker', async () => {
    const element = {
      isDisplayed: jest.fn().mockResolvedValue(true),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const selector = uuid();
    const parsedSelector = buildRegexFromParamString(selector);
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    logger.emitLogs = jest.fn();

    await checkElementAvailability(
      state,
      {
        isAvailable: true,
      },
      {
        args: {
          selector,
          marker,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      marker,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.PASS,
      type: MESSAGE_TYPE.INFO,
    });
  });

  test('assert command should emit an information message with text "TRUE" if the "is not available" assertion is true when accessing object properties near marker', async () => {
    const element = {
      isDisplayed: jest.fn().mockResolvedValue(false),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const selector = uuid();
    const parsedSelector = buildRegexFromParamString(selector);
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    logger.emitLogs = jest.fn();

    await checkElementAvailability(
      state,
      {
        isAvailable: false,
      },
      {
        args: {
          selector,
          marker,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      marker,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.PASS,
      type: MESSAGE_TYPE.INFO,
    });
  });

  test('assert command should emit an information message with text "FALSE" if the "is not available" assertion is false when accessing object properties near marker', async () => {
    const element = {
      isDisplayed: jest.fn().mockResolvedValue(true),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const selector = uuid();
    const parsedSelector = buildRegexFromParamString(selector);
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    logger.emitLogs = jest.fn();

    await checkElementAvailability(
      state,
      {
        isAvailable: false,
      },
      {
        args: {
          selector,
          marker,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      marker,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.FAIL,
      type: MESSAGE_TYPE.INFO,
    });
  });

  test('assert command should emit an information message with text "TRUE" if the "is available" assertion is true when accessing object properties near a marker, using the variable references', async () => {
    const storeKeySelector = `$${uuid()}`;
    const storeKeyMarker = `$${uuid()}`;

    const selectorValueInStore = uuid();
    const markerValueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeySelector).mockReturnValue(selectorValueInStore);
    when(store.getGlobal).calledWith(storeKeyMarker).mockReturnValue(markerValueInStore);

    const element = {
      isDisplayed: jest.fn().mockResolvedValue(true),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const parsedSelector = buildRegexFromParamString(selectorValueInStore);
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;

    await checkElementAvailability(
      state,
      {
        isAvailable: true,
      },
      {
        args: {
          selector: storeKeySelector,
          marker: storeKeyMarker,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      markerValueInStore,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.PASS,
      type: MESSAGE_TYPE.INFO,
    });
  });

  test('assert command should emit an information message with text "FALSE" if the "is available" assertion is false when accessing object properties near a marker when only the marker is referencing a variable', async () => {
    const storeKeyMarker = `$${uuid()}`;

    const selector = uuid();
    const markerValueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyMarker).mockReturnValue(markerValueInStore);

    const element = {
      isDisplayed: jest.fn().mockResolvedValue(true),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
      },
    };

    const parsedSelector = buildRegexFromParamString(selector);
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;

    await checkElementAvailability(
      state,
      {
        isAvailable: false,
      },
      {
        args: {
          selector,
          marker: storeKeyMarker,
        },
      },
    );

    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(
      findElements,
      parsedSelector,
      markerValueInStore,
      returnMultiple,
      highlightMatch,
      innerHTMLOnly,
    );
    expect(logger.emitLogs).toHaveBeenCalledWith({
      message: ASSERTION.FAIL,
      type: MESSAGE_TYPE.INFO,
    });
  });
});
