import { expect } from "@playwright/test";

export const navigateAndTestNavLogo = async (page: any) => {
  await page.goto(`${process.env.VITE_PUBLIC_BASE_URL}/`, { timeout: 2_000 });
  const navLogo = await page.getByTestId("navlogo");  
  expect(await navLogo.isVisible()).toBeTruthy();
}

