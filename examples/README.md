# Code Examples

This directory contains practical code examples and snippets for working with OptimAI Network on BNB Chain.

## Examples

- **node-integration.js**: Complete example of integrating a node with OptimAI Network
- **query-network.js**: Example queries for reading network data
- **verify-epoch.js**: Standalone verification script

## Usage

Each example can be run independently:

```bash
# Run node integration example
node examples/node-integration.js

# Query network data
node examples/query-network.js

# Verify an epoch
node examples/verify-epoch.js 1
```

## Configuration

Make sure to set up your `.env` file with:
- `PRIVATE_KEY`: Your wallet private key
- `INTEGRITY_ANCHOR_ADDRESS`: Deployed contract address
- `EPOCH_REGISTRY_ADDRESS`: Deployed contract address
- `NODE_ADDRESS`: Your node address (for node integration)

## Notes

- Examples use testnet by default
- Modify RPC URLs and contract addresses for mainnet
- Ensure you have sufficient BNB for gas fees

