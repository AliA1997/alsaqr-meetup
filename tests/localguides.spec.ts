import { test, expect } from '@playwright/test';
import { navigateAndTestNavLogo } from './reusableFunctions';

const navigateToLocalGuidesPage = async (page: any) => {
    const localGuidesLink = page.getByTestId("local guides");
    await localGuidesLink.dblclick();
};
const getLocalGuideCard = (page: any) => page.getByTestId("localguidecard").first();
const getLocalGuideDetailsAndTest = async (page: any) => {
    const localGuideDetailsCard = page.getByTestId("localguidedetailscard");
    const similarLocalGuidesMarquee = page.getByTestId("similarlocalguidesmarquee");
    await expect(localGuideDetailsCard).toBeVisible();
    await expect(similarLocalGuidesMarquee).toBeVisible();
}


test.beforeEach(async ({ page }, testInfo) => {
    test.slow();
    await navigateAndTestNavLogo(page);
});

test('local guides feed workflow', async ({ page }) => {
    await navigateToLocalGuidesPage(page);

    const localGuideCard = getLocalGuideCard(page);
    const localGuideCardName = page.getByTestId("localguidecardname").first();
    await expect(localGuideCard).toBeVisible();
    await expect(localGuideCardName).toBeVisible();

    await Promise.all([
        localGuideCard.dblclick(),
        page.waitForLoadState('networkidle')
    ])

    const origLocalGuideDetailsUrl = page.url();
    await getLocalGuideDetailsAndTest(page);

    const similarLocalGuideCard = page.getByTestId("similarlocalguidecard").first();
    await expect(similarLocalGuideCard).toBeVisible();

    await Promise.all([
        similarLocalGuideCard.dblclick(),
        page.waitForLoadState('networkidle')
    ]);
    const newLocalGuideDetailsUrl = page.url();

    expect(newLocalGuideDetailsUrl).not.toBe(origLocalGuideDetailsUrl);


    await getLocalGuideDetailsAndTest(page);

});

