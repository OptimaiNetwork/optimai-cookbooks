# Recipe 6: Building a Node Integration

This recipe shows how to integrate your node with OptimAI Network, submit task results, and earn rewards.

## 🎯 What You'll Learn

- How to register a node with OptimAI Network
- How to receive and process tasks
- How to submit task results
- How to participate in epoch creation
- How to track rewards

## 📋 Prerequisites

- Completed [Recipe 1: Setup Development Environment](./01-setup-development-environment.md)
- Node.js application or service
- Understanding of OptimAI Network architecture
- Wallet with $OPI tokens for staking (if required)

## 🚀 Step-by-Step Instructions

### Step 1: Register Your Node

```javascript
// Register node with OptimAI Network
async function registerNode(nodeAddress, nodeType) {
  // Node types: 'browser', 'mobile', 'core', 'validator', 'compute'
  const nodeConfig = {
    address: nodeAddress,
    type: nodeType,
    capabilities: {
      dataCrawl: true,
      aiProcessing: nodeType === 'core',
      validation: nodeType === 'validator',
      compute: nodeType === 'compute'
    }
  };

  // Register via OptimAI Network API or smart contract
  const response = await fetch('https://api.optimai.network/nodes/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nodeConfig)
  });

  return await response.json();
}
```

### Step 2: Listen for Task Assignments

```javascript
// Connect to OptimAI Network task queue
async function listenForTasks(nodeAddress) {
  // Subscribe to task assignments via WebSocket or polling
  const ws = new WebSocket('wss://api.optimai.network/tasks');

  ws.on('message', async (message) => {
    const task = JSON.parse(message);
    
    if (task.assignedTo === nodeAddress) {
      console.log('New task assigned:', task.taskId);
      await processTask(task);
    }
  });
}
```

### Step 3: Process Tasks

```javascript
async function processTask(task) {
  console.log(`Processing task ${task.taskId} of type ${task.type}`);

  let result;

  switch (task.type) {
    case 'data_crawl':
      result = await crawlData(task.params.url);
      break;
    
    case 'ai_processing':
      result = await processWithAI(task.params.data);
      break;
    
    case 'validation':
      result = await validateData(task.params.data);
      break;
    
    default:
      throw new Error(`Unknown task type: ${task.type}`);
  }

  // Compute result hash
  const resultHash = ethers.keccak256(
    ethers.toUtf8Bytes(JSON.stringify(result))
  );

  return {
    taskId: task.taskId,
    result: result,
    resultHash: resultHash,
    timestamp: Math.floor(Date.now() / 1000)
  };
}
```

### Step 4: Submit Task Results

```javascript
async function submitTaskResult(taskResult, nodeAddress, privateKey) {
  // Sign the result with your node's private key
  const message = JSON.stringify({
    taskId: taskResult.taskId,
    resultHash: taskResult.resultHash,
    timestamp: taskResult.timestamp
  });

  const signature = await signMessage(message, privateKey);

  // Submit to OptimAI Network
  const response = await fetch('https://api.optimai.network/tasks/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...taskResult,
      nodeAddress: nodeAddress,
      signature: signature
    })
  });

  return await response.json();
}
```

### Step 5: Participate in Epoch Creation

```javascript
// When epoch is ready, your task results are included
async function checkEpochStatus(taskIds) {
  const response = await fetch(
    `https://api.optimai.network/epochs/status?tasks=${taskIds.join(',')}`
  );
  
  const status = await response.json();
  
  if (status.anchored) {
    console.log(`Epoch ${status.epochId} anchored on opBNB`);
    console.log(`Transaction: ${status.txHash}`);
    console.log(`Your tasks included: ${status.includedTasks.length}`);
  }
}
```

## 💻 Complete Node Integration Example

```javascript
// examples/node-integration.js
const { ethers } = require('ethers');
const WebSocket = require('ws');

class OptimAINode {
  constructor(nodeAddress, privateKey, nodeType) {
    this.nodeAddress = nodeAddress;
    this.privateKey = privateKey;
    this.nodeType = nodeType;
    this.wallet = new ethers.Wallet(privateKey);
  }

  async start() {
    console.log(`Starting OptimAI Node: ${this.nodeAddress}`);
    console.log(`Node Type: ${this.nodeType}`);

    // Register node
    await this.register();

    // Start listening for tasks
    await this.listenForTasks();

    // Start health check
    this.startHealthCheck();
  }

  async register() {
    const response = await fetch('https://api.optimai.network/nodes/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: this.nodeAddress,
        type: this.nodeType,
        capabilities: this.getCapabilities()
      })
    });

    const result = await response.json();
    console.log('Node registered:', result);
  }

  getCapabilities() {
    const capabilities = {
      browser: { dataCrawl: true },
      mobile: { dataCrawl: true },
      core: { dataCrawl: true, aiProcessing: true },
      validator: { validation: true },
      compute: { compute: true }
    };
    return capabilities[this.nodeType] || {};
  }

  async listenForTasks() {
    const ws = new WebSocket('wss://api.optimai.network/tasks');

    ws.on('open', () => {
      console.log('Connected to OptimAI Network');
      ws.send(JSON.stringify({
        action: 'subscribe',
        nodeAddress: this.nodeAddress
      }));
    });

    ws.on('message', async (data) => {
      const task = JSON.parse(data);
      if (task.assignedTo === this.nodeAddress) {
        await this.handleTask(task);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  async handleTask(task) {
    console.log(`\n📋 Task received: ${task.taskId}`);
    console.log(`Type: ${task.type}`);

    try {
      const result = await this.processTask(task);
      await this.submitResult(task.taskId, result);
      console.log(`✅ Task ${task.taskId} completed`);
    } catch (error) {
      console.error(`❌ Task ${task.taskId} failed:`, error);
    }
  }

  async processTask(task) {
    // Implement task processing based on type
    switch (task.type) {
      case 'data_crawl':
        return await this.crawlData(task.params);
      case 'ai_processing':
        return await this.processAI(task.params);
      default:
        throw new Error(`Unsupported task type: ${task.type}`);
    }
  }

  async crawlData(params) {
    // Implement data crawling logic
    const response = await fetch(params.url);
    const data = await response.text();
    return { data, metadata: { url: params.url } };
  }

  async processAI(params) {
    // Implement AI processing logic
    // This would typically call your AI model
    return { processed: true, result: 'AI processing result' };
  }

  async submitResult(taskId, result) {
    const resultHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(result))
    );

    const message = JSON.stringify({
      taskId,
      resultHash,
      timestamp: Math.floor(Date.now() / 1000)
    });

    const signature = await this.wallet.signMessage(message);

    const response = await fetch('https://api.optimai.network/tasks/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        resultHash,
        timestamp: Math.floor(Date.now() / 1000),
        nodeAddress: this.nodeAddress,
        signature
      })
    });

    return await response.json();
  }

  startHealthCheck() {
    setInterval(async () => {
      await fetch('https://api.optimai.network/nodes/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeAddress: this.nodeAddress,
          status: 'online'
        })
      });
    }, 60000); // Every minute
  }
}

// Usage
const node = new OptimAINode(
  process.env.NODE_ADDRESS,
  process.env.PRIVATE_KEY,
  'browser' // or 'core', 'mobile', 'validator', 'compute'
);

node.start().catch(console.error);
```

## ✅ Verification

Your node is successfully integrated when:

- ✅ Node is registered with OptimAI Network
- ✅ Node receives task assignments
- ✅ Tasks are processed and results submitted
- ✅ Results are included in epochs
- ✅ Rewards are tracked

## 🔧 Troubleshooting

### Issue: Node not receiving tasks

**Solution**: 
- Verify node registration was successful
- Check WebSocket connection status
- Ensure node capabilities match task requirements

### Issue: Task submission fails

**Solution**:
- Verify signature is correct
- Check result hash computation
- Ensure timestamp is current

## 📚 Next Steps

- [Recipe 7: Querying OptimAI Network](./07-query-network.md)
- [Recipe 3: Anchoring Epochs on opBNB](./03-anchor-epochs.md)

## 🔗 Related Resources

- [OptimAI Network Explorer](https://explorer.optimai.network/)
- [OptimAI Node Documentation](https://docs.optimai.network/nodes)

