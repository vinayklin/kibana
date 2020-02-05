/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';

export default function({ getService, getPageObjects }) {
  const log = getService('log');
  const retry = getService('retry');
  const browser = getService('browser');
  const PageObjects = getPageObjects(['common', 'discover', 'timePicker', 'header']);

  describe('check metricbeat', function() {
    it('metricbeat- should have hit count GT 0', async function() {
      const url = await browser.getCurrentUrl();
      log.debug(url);
      if (!url.includes('kibana')) {
        await PageObjects.common.navigateToApp('discover');
      } else if (!url.includes('discover')) {
        await PageObjects.header.clickDiscover();
      }

      await PageObjects.discover.selectIndexPattern('metricbeat-*');
      await PageObjects.timePicker.setCommonlyUsedTime('superDatePickerCommonlyUsed_Today');
      await retry.try(async function() {
        const hitCount = parseInt(await PageObjects.discover.getHitCount());
        expect(hitCount).to.be.greaterThan(0);
      });
    });
  });
}
