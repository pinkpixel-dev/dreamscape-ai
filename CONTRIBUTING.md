# 🤝 Contributing to Dreamscape AI

Thank you for your interest in contributing to Dreamscape AI! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)
- [Testing](#testing)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a welcoming, inclusive, and harassment-free environment. Please be respectful of different viewpoints and experiences.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/dreamscape-ai.git
   cd dreamscape-ai
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/pinkpixel-dev/dreamscape-ai.git
   ```

## 💻 Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `wrangler.toml.example` to `wrangler.toml`
   - Add your API keys for required services:
     - IBM Watson Speech-to-Text
     - Cloudinary
     - Web scraping services

3. Start local development server:
   ```bash
   npx wrangler pages dev . --compatibility-date=2023-03-21 --port=8123
   ```

## 🔄 Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test thoroughly
4. Commit with meaningful messages:
   ```bash
   git commit -m "✨ Add new feature" -m "Detailed description of changes"
   ```

## 🔍 Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/GIFs for UI changes

## 📝 Coding Standards

### JavaScript

- Use ES6+ features
- Follow modular design patterns
- Add JSDoc comments for functions
- Use meaningful variable names
- Maintain consistent indentation (2 spaces)

### HTML/CSS

- Use semantic HTML elements
- Follow BEM naming convention
- Maintain responsive design
- Support dark mode
- Test cross-browser compatibility

### API Development

- Follow RESTful principles
- Include proper error handling
- Add request validation
- Document API endpoints
- Implement proper CORS headers

## 📖 Documentation

- Keep README.md updated
- Document new features
- Add JSDoc comments
- Update CHANGELOG.md
- Include examples for new functionality

## ✅ Testing

- Add tests for new features
- Maintain existing tests
- Test browser compatibility
- Verify API endpoints
- Test error scenarios

## 🏗️ Project Structure

- `/functions` - Cloudflare Worker functions
- `/public` - Frontend assets
- `/docs` - Documentation files
- `/backups` - Backup files
- `wrangler.toml` - Cloudflare configuration

## 💡 Feature Requests

1. Check existing issues first
2. Use the feature request template
3. Provide clear use cases
4. Include potential implementation details

## 🐛 Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/environment details

---

✨ Made with ❤️ by Pink Pixel

Remember to respect the project's license and guidelines. Questions? Feel free to open an issue!