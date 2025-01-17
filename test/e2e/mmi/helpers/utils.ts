import { type BrowserContext, type Page, expect } from '@playwright/test';

export const generateAccounts = () => {
  const alpha = Array.from(Array(10)).map((_, i) => i + 65);
  const alphabet = alpha.map(
    (x) => `Custody Account ${String.fromCharCode(x)}`,
  );

  return alphabet;
};

export async function checkLinkURL(
  context: BrowserContext,
  page: Page,
  textToSearch: string,
  URLlink: string,
  role: 'link' | 'button' = 'link',
) {
  function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  }
  const links = await page.getByRole(role, { name: textToSearch }).all();
  for (const link of links) {
    const pagePromise = context.waitForEvent('page');
    await link.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    const regex = new RegExp(`.*${escapeRegExp(URLlink)}.*`, 'iu');
    await expect.soft(newPage).toHaveURL(regex);
    console.log(`click in ${textToSearch} and opening page ${newPage.url()}`);
    await newPage.close();
  }
}
