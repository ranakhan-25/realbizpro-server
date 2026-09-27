/**
 * Load Testing Script for POS Sale System
 *
 * This script simulates high-concurrency POS sales to test system capacity.
 * Use this to verify performance improvements and identify bottlenecks.
 *
 * Usage:
 *   node scripts/load-test-pos.js
 *
 * Configuration:
 *   Edit the CONFIG object below to customize test parameters
 */

const io = require('socket.io-client');
const { performance } = require('perf_hooks');

// ==================== CONFIGURATION ====================

const CONFIG = {
  // Server settings
  SERVER_URL: 'http://localhost:5000',
  NAMESPACE: '/pos-sales',

  // Authentication
  JWT_TOKEN: 'YOUR_JWT_TOKEN_HERE', // Replace with valid token

  // Test parameters
  CONCURRENT_CONNECTIONS: 50, // Number of simultaneous connections
  SALES_PER_CONNECTION: 5, // Number of sales per connection
  RAMP_UP_TIME: 2000, // Time to establish all connections (ms)

  // Test data
  TEST_SHOWROOM_ID: 1,
  TEST_SALESMAN_ID: 1,
  TEST_COUNTER_NUMBER: 1,

  // Timeouts
  CONNECT_TIMEOUT: 10000, // Connection timeout (ms)
  SALE_TIMEOUT: 30000, // Individual sale timeout (ms)
};

// ==================== TEST DATA GENERATOR ====================

function generateTestSale() {
  return {
    salesmanId: CONFIG.TEST_SALESMAN_ID,
    payments: [
      {
        paymentMethod: 'CASH',
        amount:
          Math.floor(Math.random() * 5000) + 1000, // 1000-6000
      },
    ],
    notes: `Load test sale - ${Date.now()}`,
  };
}

// ==================== STATISTICS COLLECTOR ====================

class Statistics {
  constructor() {
    this.success = 0;
    this.failed = 0;
    this.responseTimes = [];
    this.errors = {};
    this.startTime = null;
    this.endTime = null;
  }

  recordSuccess(duration) {
    this.success++;
    this.responseTimes.push(duration);
  }

  recordFailure(error) {
    this.failed++;
    const errorType =
      error.message || 'Unknown error';
    this.errors[errorType] =
      (this.errors[errorType] || 0) + 1;
  }

  calculate() {
    if (this.responseTimes.length === 0) {
      return {
        totalRequests: this.success + this.failed,
        successRate: 0,
        failureRate: 100,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        throughput: 0,
        duration: 0,
        errors: this.errors,
      };
    }

    const sorted = [...this.responseTimes].sort(
      (a, b) => a - b,
    );
    const duration =
      (this.endTime - this.startTime) / 1000; // seconds
    const totalRequests =
      this.success + this.failed;

    return {
      totalRequests,
      successCount: this.success,
      failedCount: this.failed,
      successRate: (
        (this.success / totalRequests) *
        100
      ).toFixed(2),
      failureRate: (
        (this.failed / totalRequests) *
        100
      ).toFixed(2),
      avgResponseTime: (
        sorted.reduce((a, b) => a + b, 0) /
        sorted.length
      ).toFixed(2),
      minResponseTime: sorted[0].toFixed(2),
      maxResponseTime:
        sorted[sorted.length - 1].toFixed(2),
      p50: sorted[
        Math.floor(sorted.length * 0.5)
      ].toFixed(2),
      p95: sorted[
        Math.floor(sorted.length * 0.95)
      ].toFixed(2),
      p99: sorted[
        Math.floor(sorted.length * 0.99)
      ].toFixed(2),
      throughput: (
        totalRequests / duration
      ).toFixed(2),
      duration: duration.toFixed(2),
      errors: this.errors,
    };
  }

  printReport() {
    const stats = this.calculate();

    console.log('\n' + '='.repeat(60));
    console.log(
      '                    LOAD TEST RESULTS',
    );
    console.log('='.repeat(60));

    console.log('\n📊 SUMMARY:');
    console.log(
      `   Total Requests:    ${stats.totalRequests}`,
    );
    console.log(
      `   ✅ Successful:      ${stats.successCount} (${stats.successRate}%)`,
    );
    console.log(
      `   ❌ Failed:          ${stats.failedCount} (${stats.failureRate}%)`,
    );
    console.log(
      `   🚀 Throughput:      ${stats.throughput} requests/second`,
    );
    console.log(
      `   ⏱️  Duration:        ${stats.duration} seconds`,
    );

    console.log('\n⏱️  RESPONSE TIMES:');
    console.log(
      `   Min:               ${stats.minResponseTime} ms`,
    );
    console.log(
      `   Average:           ${stats.avgResponseTime} ms`,
    );
    console.log(
      `   Max:               ${stats.maxResponseTime} ms`,
    );
    console.log(
      `   50th percentile:   ${stats.p50} ms`,
    );
    console.log(
      `   95th percentile:   ${stats.p95} ms`,
    );
    console.log(
      `   99th percentile:   ${stats.p99} ms`,
    );

    if (Object.keys(stats.errors).length > 0) {
      console.log('\n❌ ERRORS:');
      Object.entries(stats.errors).forEach(
        ([error, count]) => {
          console.log(`   ${error}: ${count}`);
        },
      );
    }

    console.log('\n' + '='.repeat(60));

    // Performance evaluation
    console.log('\n📈 PERFORMANCE EVALUATION:\n');

    const throughput = parseFloat(
      stats.throughput,
    );
    const avgTime = parseFloat(
      stats.avgResponseTime,
    );
    const p95Time = parseFloat(stats.p95);
    const successRate = parseFloat(
      stats.successRate,
    );

    if (successRate < 95) {
      console.log(
        '   ❌ CRITICAL: Success rate below 95%',
      );
    } else if (successRate < 99) {
      console.log(
        '   ⚠️  WARNING: Success rate below 99%',
      );
    } else {
      console.log(
        '   ✅ SUCCESS: Success rate above 99%',
      );
    }

    if (p95Time > 500) {
      console.log(
        '   ❌ CRITICAL: P95 response time above 500ms',
      );
    } else if (p95Time > 200) {
      console.log(
        '   ⚠️  WARNING: P95 response time above 200ms',
      );
    } else {
      console.log(
        '   ✅ SUCCESS: P95 response time below 200ms',
      );
    }

    if (throughput < 100) {
      console.log(
        '   ❌ CRITICAL: Throughput below 100 sales/sec',
      );
    } else if (throughput < 300) {
      console.log(
        '   ⚠️  WARNING: Throughput below 300 sales/sec',
      );
    } else {
      console.log(
        '   ✅ SUCCESS: Throughput above 300 sales/sec',
      );
    }

    console.log('\n' + '='.repeat(60) + '\n');

    return stats;
  }
}

// ==================== CONNECTION MANAGER ====================

class ConnectionManager {
  constructor(config, stats) {
    this.config = config;
    this.stats = stats;
    this.sockets = [];
  }

  async createConnection(index) {
    return new Promise((resolve, reject) => {
      const socket = io(
        `${this.config.SERVER_URL}${this.config.NAMESPACE}`,
        {
          auth: {
            token: this.config.JWT_TOKEN,
          },
          transports: ['websocket'],
          reconnection: false,
          timeout: this.config.CONNECT_TIMEOUT,
        },
      );

      const connectTimeout = setTimeout(() => {
        socket.close();
        reject(new Error('Connection timeout'));
      }, this.config.CONNECT_TIMEOUT);

      socket.on('connect', () => {
        clearTimeout(connectTimeout);

        // Setup counter
        socket.emit('setup-counter', {
          counterNumber:
            this.config.TEST_COUNTER_NUMBER,
        });

        socket.once('counter-setup', () => {
          resolve(socket);
        });

        // Fallback if counter-setup not received
        setTimeout(() => resolve(socket), 500);
      });

      socket.on('connect_error', (error) => {
        clearTimeout(connectTimeout);
        reject(error);
      });
    });
  }

  async establishConnections() {
    console.log(
      `⏳ Establishing ${this.config.CONCURRENT_CONNECTIONS} connections...`,
    );

    const connectionPromises = [];
    const delayBetween =
      this.config.RAMP_UP_TIME /
      this.config.CONCURRENT_CONNECTIONS;

    for (
      let i = 0;
      i < this.config.CONCURRENT_CONNECTIONS;
      i++
    ) {
      connectionPromises.push(
        new Promise(async (resolve) => {
          await new Promise((r) =>
            setTimeout(r, i * delayBetween),
          );
          try {
            const socket =
              await this.createConnection(i);
            this.sockets.push(socket);
            resolve({ success: true, index: i });
          } catch (error) {
            resolve({
              success: false,
              index: i,
              error,
            });
          }
        }),
      );
    }

    const results = await Promise.all(
      connectionPromises,
    );
    const successful = results.filter(
      (r) => r.success,
    ).length;
    const failed = results.filter(
      (r) => !r.success,
    ).length;

    console.log(
      `✅ Connected: ${successful} / ${this.config.CONCURRENT_CONNECTIONS}`,
    );
    if (failed > 0) {
      console.log(
        `❌ Failed connections: ${failed}`,
      );
    }

    return successful > 0;
  }

  async executeSale(socket) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const saleData = generateTestSale();

      const timeout = setTimeout(() => {
        reject(new Error('Sale timeout'));
      }, this.config.SALE_TIMEOUT);

      socket.emit('finalize-sale', saleData);

      socket.once(
        'sale-finalized',
        (response) => {
          clearTimeout(timeout);
          const duration =
            performance.now() - startTime;
          this.stats.recordSuccess(duration);
          resolve(response);
        },
      );

      socket.once('error', (error) => {
        clearTimeout(timeout);
        this.stats.recordFailure(error);
        reject(error);
      });
    });
  }

  async runLoadTest() {
    console.log(`🚀 Starting load test...`);
    console.log(
      `   Sales per connection: ${this.config.SALES_PER_CONNECTION}`,
    );
    console.log(
      `   Total sales: ${this.config.CONCURRENT_CONNECTIONS * this.config.SALES_PER_CONNECTION}`,
    );

    this.stats.startTime = performance.now();

    const salePromises = this.sockets.flatMap(
      (socket) => {
        return Array(
          this.config.SALES_PER_CONNECTION,
        )
          .fill(0)
          .map(() =>
            this.executeSale(socket).catch(
              (err) => {
                // Error already recorded in executeSale
              },
            ),
          );
      },
    );

    await Promise.allSettled(salePromises);

    this.stats.endTime = performance.now();
  }

  cleanup() {
    console.log(
      '\n🧹 Cleaning up connections...',
    );
    this.sockets.forEach((socket) =>
      socket.disconnect(),
    );
  }
}

// ==================== MAIN EXECUTION ====================

async function main() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log(
    '           POS SALE SYSTEM - LOAD TEST',
  );
  console.log('='.repeat(60) + '\n');

  console.log('⚙️  CONFIGURATION:');
  console.log(
    `   Server:            ${CONFIG.SERVER_URL}${CONFIG.NAMESPACE}`,
  );
  console.log(
    `   Connections:       ${CONFIG.CONCURRENT_CONNECTIONS}`,
  );
  console.log(
    `   Sales/Connection:  ${CONFIG.SALES_PER_CONNECTION}`,
  );
  console.log(
    `   Total Sales:       ${CONFIG.CONCURRENT_CONNECTIONS * CONFIG.SALES_PER_CONNECTION}`,
  );
  console.log(
    `   Ramp-up Time:      ${CONFIG.RAMP_UP_TIME}ms`,
  );
  console.log('');

  // Validate configuration
  if (
    CONFIG.JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE'
  ) {
    console.error(
      '❌ ERROR: Please set a valid JWT_TOKEN in the CONFIG object\n',
    );
    process.exit(1);
  }

  const stats = new Statistics();
  const manager = new ConnectionManager(
    CONFIG,
    stats,
  );

  try {
    // Establish connections
    const connected =
      await manager.establishConnections();

    if (!connected) {
      console.error(
        '❌ Failed to establish any connections. Exiting...\n',
      );
      process.exit(1);
    }

    // Wait a bit for all connections to stabilize
    await new Promise((resolve) =>
      setTimeout(resolve, 1000),
    );

    // Run load test
    await manager.runLoadTest();

    // Print results
    const results = stats.printReport();

    // Cleanup
    manager.cleanup();

    // Exit with appropriate code
    const success =
      parseFloat(results.successRate) >= 95 &&
      parseFloat(results.p95) <= 500;
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(
      '\n❌ Load test failed:',
      error,
    );
    manager.cleanup();
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  CONFIG,
  Statistics,
  ConnectionManager,
};
