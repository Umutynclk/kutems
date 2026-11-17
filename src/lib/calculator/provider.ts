import { CalculationProvider, MockCalculationProvider } from "./engine";

let cachedProvider: CalculationProvider | null = null;

export function getCalculationProvider(): CalculationProvider {
  if (!cachedProvider) {
    // In the future, if CALCULATION_API_URL and CALCULATION_API_KEY exist,
    // we can return RemoteKUTEMSCalculationProvider here.
    cachedProvider = new MockCalculationProvider();
  }
  return cachedProvider;
}
