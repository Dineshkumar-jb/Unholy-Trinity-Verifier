# Contributing to Unholy Trinity Verifier

Thank you for your interest in contributing to **Unholy Trinity Verifier**!

## Development Guidelines

1. **Fork the Repository:**
   Create a personal fork of the repository and clone it to your local environment.

2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

4. **Verify Tests Pass Before Submitting:**
   Always run the smart contract test suite before creating a pull request:
   ```bash
   npx hardhat test
   ```
   Ensure all 40 unit tests pass without errors.

5. **Code Style & Formatting:**
   - Write clean, well-commented code.
   - Follow standard Solidity conventions and OpenZeppelin security guidelines.
   - Maintain the existing clean light theme tokens in CSS.

6. **Submit a Pull Request:**
   Provide a clear summary of your changes, reference any relevant issues, and ensure no secrets or environment files are included in your commits.
