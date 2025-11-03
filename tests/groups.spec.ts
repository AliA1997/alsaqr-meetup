import { test, expect } from '@playwright/test';
import { navigateAndTestNavLogo } from './reusableFunctions';

const navigateToGroupsPage = async (page: any) => {
  const groupsLink = await page.getByTestId("groups");
  await groupsLink.dblclick();
};
const getGroupCard = (page: any) => page.getByTestId("groupcard").first();
const getGroupDetailsAndTest = async (page: any) => {
  const groupDetailsCard = await page.getByTestId("groupdetailscard");
  const similarGroupsMarquee = await page.getByTestId("similargroupsmarquee");
  await expect(groupDetailsCard).toBeVisible({ timeout: 2_000 });
  await expect(similarGroupsMarquee).toBeVisible({ timeout: 2_000 });
}


test.beforeEach(async ({ page }, testInfo) => {
  test.slow();
  await navigateAndTestNavLogo(page);
});

test('groups feed workflow', async ({ page }) => {
  await navigateToGroupsPage(page);

  const groupCard = getGroupCard(page);
  const groupCardName = page.getByTestId("groupcardname").first();
  const groupCardLocation = page.getByTestId("groupcardlocation").first();

  await expect(groupCard).toBeVisible();
  await expect(groupCardName).toBeVisible();
  await expect(groupCardLocation).toBeVisible();

  await Promise.all([
    groupCard.dblclick(),
    page.waitForLoadState('networkidle')
  ]);

  const origGroupDetailsUrl = page.url();
  await getGroupDetailsAndTest(page);

  const similarGroupCard = page.getByTestId("similargroupcard").last();

  await expect(similarGroupCard).toBeVisible();
  await Promise.all([
    similarGroupCard.dblclick(),
    page.waitForLoadState('networkidle')
  ]);

  const newGroupDetailsUrl = page.url();

  expect(newGroupDetailsUrl).not.toBe(origGroupDetailsUrl);

  await getGroupDetailsAndTest(page);

});

