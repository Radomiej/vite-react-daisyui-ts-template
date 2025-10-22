import { defineConfig, devices } from '@playwright/test';

// Sprawdzenie czy jesteśmy w CI (można dostosować w zależności od używanego CI)
const isCI = false;

// Konfiguracja dla wielu workerów
const workerCount = 10; // Minimalna liczba workerów

export default defineConfig({
  // Szukaj testów e2e w katalogach __tests__ z nazwą *.e2e.test.ts
  testDir: './src',
  testMatch: '**/__tests__/*.e2e.test.ts',
  // Katalog na wyniki testów (będzie dodany do .gitignore)
  outputDir: './test-results',
  // Zwiększamy globalny timeout dla wszystkich testów
  timeout: 50000, // 50 sekund na test
  // Włączamy pełne zrównoleglenie dla wielu workerów
  fullyParallel: true,
  // Konfiguracja dla CI i lokalnego środowiska
  forbidOnly: isCI,
  // Ustawiamy retries na 0, aby testy musiały przejść od razu
  retries: 0,
  // Ustawiamy liczbę workerów na co najmniej 10
  workers: isCI ? 1 : workerCount,
  // Używamy reportera 'list' dla konsoli i 'html' dla raportu HTML
  reporter: [["list"], ["html", { open: "never" }]],
  // Zwiększamy czas oczekiwania na zamknięcie przeglądarki
  expect: {
    timeout: 10000, // 10 sekund na asercje
  },
  use: {
    baseURL: 'http://localhost:5173', // Standardowy port Vite
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Dodajemy opcje stabilizujące działanie przeglądarek
    actionTimeout: 15000, // 15 sekund na akcje
    navigationTimeout: 30000, // 30 sekund na nawigację
    // Dodajemy opcję dla bardziej stabilnego zamykania przeglądarek
    launchOptions: {
      slowMo: 100, // Spowalniamy akcje o 100ms dla większej stabilności
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'yarn dev',
    port: 5173,
    reuseExistingServer: false, // Zawsze uruchamiaj nowy serwer
    timeout: 180000, // Zwiększamy czas oczekiwania na uruchomienie serwera (180 sekund)
  },
  
  // Run all tests
  // grep: /should reorder tasks within the same column|should move task to the start of another column|should move task to the end of another column|should move task between multiple columns/,
});
