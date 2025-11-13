# 🔐 Security Notice

## Environment Variables

This project uses environment variables for configuration. **Never commit real API keys or secrets** to the repository.

### Required Environment Variables (for production)

```bash
# AI Assistant Providers
VITE_LITELLM_TEST_URL=http://localhost:4000
VITE_LITELLM_PROD_URL=https://api.litellm.com
VITE_LITELLM_API_KEY=your-actual-key-here

VITE_N8N_TEST_URL=http://localhost:5678/webhook/test
VITE_N8N_PROD_URL=https://your-n8n.com/webhook/prod
VITE_N8N_API_KEY=your-actual-key-here
```

### Security Best Practices

1. **Use environment variables** for all sensitive data
2. **Never hardcode API keys** in the source code
3. **Use different keys** for development and production
4. **Rotate keys regularly**
5. **Use HTTPS** in production environments

## Tauri Desktop Security

The desktop app includes command execution capabilities:

- ✅ Commands are executed in isolated environment
- ✅ No filesystem access without explicit permissions
- ✅ CSP headers configured for security
- ⚠️ **Review command whitelist** before production deployment

## Data Storage

- API keys are stored in component state (not persisted)
- No sensitive data is written to disk
- LocalStorage used only for non-sensitive tokens

## Reporting Security Issues

If you find a security vulnerability, please report it privately rather than creating a public issue.
