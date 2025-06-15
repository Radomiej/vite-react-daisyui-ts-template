---
trigger: model_decision
description: How to write correct test - use when writing test for project
---

**Frontend Testing Guidelines for LLM Agents**

1. **Follow the Testing Pyramid**
    - Structure your test suite with a strong base of unit tests, a moderate layer of integration tests, and a smaller set of end-to-end (E2E) tests[^2][^5][^7].
    - Unit tests should cover isolated functions or components.
    - Integration tests should verify how components work together.
    - E2E tests should validate critical user flows in a real browser environment.
2. **Apply the F.I.R.S.T. Principles**
    - **Fast:** Tests should execute quickly to provide rapid feedback.
    - **Isolated/Independent:** Tests must not depend on each other or external state.
    - **Repeatable:** Tests should produce consistent results every run.
    - **Self-validating:** Each test must clearly pass or fail without manual inspection.
    - **Thorough:** Cover all relevant scenarios, including edge cases[^2][^7][^5].
3. **Test Like a User**
    - Simulate real user interactions and behaviors.
    - Use queries based on roles, labels, and visible text (e.g., `getByRole`, `getByLabelText`) to promote accessibility and realistic testing[^1][^9].
    - Avoid testing implementation details or internal component structure.
4. **Prioritize Critical User Flows and Elements**
    - Focus first on navigation, forms, buttons, and other high-impact UI elements[^4][^5][^7].
    - Ensure business-critical flows are always covered by tests.
5. **Ensure Cross-Browser, Cross-Device, and Accessibility Compliance**
    - Test your application on multiple browsers and devices to ensure consistent behavior and appearance[^2][^5][^7].
    - Include accessibility (a11y) checks to guarantee usability for all users.
6. **Automate and Integrate Testing**
    - Automate repetitive scenarios to improve efficiency and reduce human error[^5][^6].
    - Integrate your tests with CI/CD pipelines to run them on every code change and enforce quality gates[^3][^6].
7. **Maintain Test Quality**
    - Write clean, reusable, and maintainable tests.
    - Regularly review and refactor tests to prevent flakiness and reduce maintenance costs[^5][^8].
    - Use realistic test data and simulate real-world conditions where possible[^6][^7].
8. **Monitor and Analyze Test Results**
    - Continuously monitor test outcomes and investigate failures promptly.
    - Use analytics to identify patterns, bottlenecks, and areas for improvement[^5][^6].
9. **Use Appropriate Tools**
    - For React/TypeScript: Prefer Jest, React Testing Library, and MSW for unit/integration tests; Cypress or Playwright for E2E.
    - Employ visual regression and performance testing tools as needed[^5][^6].
10. **Test Early and Often**
    - Begin testing as soon as development starts and continue throughout the lifecycle[^5][^6].
    - Update and expand tests alongside new features and bug fixes.

These guidelines ensure robust, reliable, and user-centric frontend test suites that scale with your application and development team.

<div style="text-align: center">⁂</div>

[^1]: https://docs.gitlab.com/development/testing_guide/frontend_testing/

[^2]: https://www.netguru.com/blog/front-end-testing

[^3]: https://www.chromatic.com/frontend-testing-guide

[^4]: https://eluminoustechnologies.com/blog/front-end-testing/

[^5]: https://crustlab.com/blog/guide-on-frontend-testing/

[^6]: https://dev.to/josematoswork/the-ultimate-guide-to-frontend-testing-tips-tools-and-best-practices-pod

[^7]: https://www.linkedin.com/pulse/complete-front-end-testing-guide-2025-japneet-sachdeva-uojxc

[^8]: https://alexop.dev/posts/frontend-testing-guide-10-essential-rules/

[^9]: https://infinum.com/handbook/frontend/react/testing/best-practices

[^10]: https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices

[^11]: https://www.fe.engineer/handbook/testing/advanced

[^12]: https://qawerk.com/blog/front-end-testing-checklist/

[^13]: https://assets.ctfassets.net/czwjnyf8a9ri/5n958XreM32JC3rP2VDrzx/5dd8a06c7c902b9a9827d7c74f6835ba/36_SL_WP_Best_Practices_for_Front-End_Performance_Testing_v2.pdf

[^14]: https://dev.to/lucasm/frontend-best-practices-guide-or-dont-do-it-on-frontend-32n4

[^15]: https://developers.google.com/solutions/content-driven/frontend/testing

