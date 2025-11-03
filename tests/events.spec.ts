import { test, expect } from '@playwright/test';
import { navigateAndTestNavLogo } from './reusableFunctions';

const navigateToEventsPage = async (page: any) => {
    const eventsLink = page.getByTestId("events");
    await eventsLink.dblclick();
};
const navigateToOnlineEventsPage = async (page: any) => {
    const onlineEventsLink = page.getByTestId('online events');
    await onlineEventsLink.dblclick();
}
const getEventDetailsAndTest = async (page: any) => {
    const eventDetailsCard = page.getByTestId("eventdetailscard");
    const similarEventsMarquee = page.getByTestId("similareventsmarquee");

    await expect(eventDetailsCard).toBeVisible({ timeout: 2_000 });
    await expect(similarEventsMarquee).toBeVisible({ timeout: 2_000 });
};

test.beforeEach(async ({ page }) => {
    test.slow();
    await navigateAndTestNavLogo(page);
});

test('events feed workflow', async ({ page }) => {
    await navigateToEventsPage(page);

    const eventCard = page.getByTestId("eventcard").first();
    await expect(eventCard).toBeVisible();

    const eventCardName = page.getByTestId("eventcardname").first();
    const eventCardHostedCities = page.getByTestId("eventhostedcities").first();

    await expect(eventCardName).toBeVisible();
    await expect(eventCardHostedCities).toBeVisible();

    await Promise.all([
        eventCard.dblclick(),
        page.waitForLoadState('networkidle')
    ])
    await getEventDetailsAndTest(page);

    const origEventDetailsUrl = page.url();
    // console.log('origEventDetailsUrl', origEventDetailsUrl);

    const similarEventCard = page.getByTestId("similareventcard").last();
    await expect(similarEventCard).toBeVisible();

    await Promise.all([
        similarEventCard.dblclick(),
        page.waitForLoadState('networkidle')
    ]);

    const newEventDetailsUrl = page.url();
    // console.log('newEventDetailsUrl', newEventDetailsUrl);

    expect(newEventDetailsUrl).not.toBe(origEventDetailsUrl);

    await getEventDetailsAndTest(page);
});

test('online events feed workflow', async ({ page }) => {
    await navigateToOnlineEventsPage(page);

    const eventCard = page.getByTestId("eventcard").first();
    await expect(eventCard).toBeVisible();

    const eventCardName = page.getByTestId("eventcardname").first();
    const eventCardHostedCities = page.getByTestId("eventhostedcities").first();

    await expect(eventCardName).toBeVisible();
    await expect(eventCardHostedCities).toBeVisible();

    await Promise.all([
        eventCard.dblclick(),
        page.waitForLoadState('networkidle')
    ])

    await getEventDetailsAndTest(page);

    const origEventDetailsUrl = page.url();

    const similarEventCard = page.getByTestId("similareventcard").last();
    await expect(similarEventCard).toBeVisible();

    await Promise.all([
        similarEventCard.dblclick(),
        page.waitForLoadState('networkidle')
    ])

    const newEventDetailsUrl = page.url();

    expect(newEventDetailsUrl).not.toBe(origEventDetailsUrl);
    await getEventDetailsAndTest(page);
});