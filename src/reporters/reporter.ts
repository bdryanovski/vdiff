export abstract class Reporter {
  describe(name: string): void { }
  fail(test: any, error: any): void { }
  success(name: string): void { }
  noTestFound(): void { }
  report(): void { }
}