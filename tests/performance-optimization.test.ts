import { describe, it, expect, beforeEach } from "vitest"

// Mock blockchain state
let mockBlockHeight = 1000
let mockTxSender = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

// Mock contract state
const performanceMetrics = new Map()
const optimizationRules = new Map()
const resourceAllocations = new Map()
let globalEfficiencyScore = 75
let optimizationCycles = 0

// Optimization types
const OPTIMIZATION_BANDWIDTH = 1
const OPTIMIZATION_LATENCY = 2
const OPTIMIZATION_ENERGY = 3
const OPTIMIZATION_QUANTUM_COHERENCE = 4

// Error constants
const ERR_OWNER_ONLY = 500
const ERR_METRIC_NOT_FOUND = 501
const ERR_INVALID_THRESHOLD = 502
const ERR_OPTIMIZATION_FAILED = 503

describe("Performance Optimization Contract", () => {
  beforeEach(() => {
    // Reset state before each test
    performanceMetrics.clear()
    optimizationRules.clear()
    resourceAllocations.clear()
    globalEfficiencyScore = 75
    optimizationCycles = 0
    mockBlockHeight = 1000
  })
  
  describe("register-metric", () => {
    it("should successfully register performance metric", () => {
      const metricId = "bandwidth-utilization"
      const metricName = "Network Bandwidth Utilization"
      const targetValue = 80
      const thresholdMin = 60
      const thresholdMax = 90
      const optimizationType = OPTIMIZATION_BANDWIDTH
      
      const result = registerMetric(metricId, metricName, targetValue, thresholdMin, thresholdMax, optimizationType)
      
      expect(result.success).toBe(true)
      expect(performanceMetrics.has(metricId)).toBe(true)
      
      const metric = performanceMetrics.get(metricId)
      expect(metric.metricName).toBe(metricName)
      expect(metric.targetValue).toBe(targetValue)
      expect(metric.thresholdMin).toBe(thresholdMin)
      expect(metric.thresholdMax).toBe(thresholdMax)
      expect(metric.optimizationType).toBe(optimizationType)
      expect(metric.currentValue).toBe(0)
      expect(metric.lastMeasured).toBe(mockBlockHeight)
    })
    
    it("should register different optimization types", () => {
      const metrics = [
        { id: "bandwidth", name: "Bandwidth", target: 80, min: 60, max: 90, type: OPTIMIZATION_BANDWIDTH },
        { id: "latency", name: "Latency", target: 10, min: 5, max: 15, type: OPTIMIZATION_LATENCY },
        { id: "energy", name: "Energy Efficiency", target: 85, min: 70, max: 95, type: OPTIMIZATION_ENERGY },
        {
          id: "quantum",
          name: "Quantum Coherence",
          target: 95,
          min: 90,
          max: 99,
          type: OPTIMIZATION_QUANTUM_COHERENCE,
        },
      ]
      
      metrics.forEach((metric) => {
        const result = registerMetric(metric.id, metric.name, metric.target, metric.min, metric.max, metric.type)
        expect(result.success).toBe(true)
      })
      
      expect(performanceMetrics.size).toBe(4)
    })
    
    it("should fail with invalid thresholds", () => {
      const result = registerMetric("invalid-metric", "Invalid Metric", 80, 90, 70, OPTIMIZATION_BANDWIDTH)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERR_INVALID_THRESHOLD)
    })
    
    it("should fail when called by non-owner", () => {
      const originalSender = mockTxSender
      mockTxSender = "ST2DIFFERENT_ADDRESS"
      
      const result = registerMetric("test-metric", "Test Metric", 80, 60, 90, OPTIMIZATION_BANDWIDTH)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERR_OWNER_ONLY)
      
      mockTxSender = originalSender
    })
  })
  
  describe("update-metric", () => {
    beforeEach(() => {
      registerMetric("test-metric", "Test Metric", 80, 60, 90, OPTIMIZATION_BANDWIDTH)
    })
    
    it("should successfully update metric value", () => {
      const metricId = "test-metric"
      const newValue = 75
      
      const result = updateMetric(metricId, newValue)
      
      expect(result.success).toBe(true)
      
      const metric = performanceMetrics.get(metricId)
      expect(metric.currentValue).toBe(newValue)
      expect(metric.lastMeasured).toBe(mockBlockHeight)
    })
    
    it("should fail for non-existent metric", () => {
      const result = updateMetric("non-existent", 75)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERR_METRIC_NOT_FOUND)
    })
    
    it("should handle multiple metric updates", () => {
      const metricId = "test-metric"
      const values = [65, 70, 85, 90, 75]
      
      values.forEach((value, index) => {
        mockBlockHeight = 1000 + index
        const result = updateMetric(metricId, value)
        expect(result.success).toBe(true)
        expect(performanceMetrics.get(metricId).currentValue).toBe(value)
      })
    })
  })
  
  describe("create-optimization-rule", () => {
    it("should successfully create optimization rule", () => {
      const ruleId = "bandwidth-optimization"
      const ruleName = "Bandwidth Optimization Rule"
      const triggerCondition = "bandwidth_utilization > 85"
      const optimizationAction = "redistribute_traffic_load"
      const priority = 8
      const quantumEnhanced = true
      
      const result = createOptimizationRule(
          ruleId,
          ruleName,
          triggerCondition,
          optimizationAction,
          priority,
          quantumEnhanced,
      )
      
      expect(result.success).toBe(true)
      expect(optimizationRules.has(ruleId)).toBe(true)
      
      const rule = optimizationRules.get(ruleId)
      expect(rule.ruleName).toBe(ruleName)
      expect(rule.triggerCondition).toBe(triggerCondition)
      expect(rule.optimizationAction).toBe(optimizationAction)
      expect(rule.priority).toBe(priority)
      expect(rule.quantumEnhanced).toBe(quantumEnhanced)
      expect(rule.executionCount).toBe(0)
    })
    
    it("should create multiple optimization rules", () => {
      const rules = [
        {
          id: "rule-1",
          name: "Latency Rule",
          condition: "latency > 20",
          action: "optimize_routing",
          priority: 9,
          quantum: true,
        },
        {
          id: "rule-2",
          name: "Energy Rule",
          condition: "energy_efficiency < 70",
          action: "reduce_power_consumption",
          priority: 7,
          quantum: false,
        },
        {
          id: "rule-3",
          name: "Quantum Rule",
          condition: "quantum_coherence < 90",
          action: "recalibrate_quantum_systems",
          priority: 10,
          quantum: true,
        },
      ]
      
      rules.forEach((rule) => {
        const result = createOptimizationRule(
            rule.id,
            rule.name,
            rule.condition,
            rule.action,
            rule.priority,
            rule.quantum,
        )
        expect(result.success).toBe(true)
      })
      
      expect(optimizationRules.size).toBe(3)
    })
    
    it("should fail when called by non-owner", () => {
      const originalSender = mockTxSender
      mockTxSender = "ST2DIFFERENT_ADDRESS"
      
      const result = createOptimizationRule("test-rule", "Test Rule", "condition", "action", 5, false)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERR_OWNER_ONLY)
      
      mockTxSender = originalSender
    })
  })
  
  describe("allocate-resources", () => {
    it("should successfully allocate resources", () => {
      const allocationId = "cpu-allocation-001"
      const resourceType = "quantum-processing-unit"
      const allocatedAmount = 800
      const maxCapacity = 1000
      const quantumOptimized = true
      
      const result = allocateResources(allocationId, resourceType, allocatedAmount, maxCapacity, quantumOptimized)
      
      expect(result.success).toBe(true)
      expect(resourceAllocations.has(allocationId)).toBe(true)
      
      const allocation = resourceAllocations.get(allocationId)
      expect(allocation.resourceType).toBe(resourceType)
      expect(allocation.allocatedAmount).toBe(allocatedAmount)
      expect(allocation.maxCapacity).toBe(maxCapacity)
      expect(allocation.quantumOptimized).toBe(quantumOptimized)
      expect(allocation.efficiencyScore).toBe(95) // Quantum optimized
    })
    
    it("should handle non-quantum optimized resources", () => {
      const allocationId = "classical-allocation"
      const result = allocateResources(allocationId, "classical-cpu", 500, 1000, false)
      
      expect(result.success).toBe(true)
      expect(resourceAllocations.get(allocationId).efficiencyScore).toBe(80) // Non-quantum
    })
    
    it("should fail when allocation exceeds capacity", () => {
      const result = allocateResources("invalid-allocation", "cpu", 1200, 1000, false)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERR_INVALID_THRESHOLD)
    })
    
    it("should handle multiple resource allocations", () => {
      const allocations = [
        { id: "cpu-001", type: "quantum-cpu", amount: 800, capacity: 1000, quantum: true },
        { id: "memory-001", type: "quantum-memory", amount: 600, capacity: 800, quantum: true },
        { id: "storage-001", type: "classical-storage", amount: 500, capacity: 1000, quantum: false },
      ]
      
      allocations.forEach((allocation) => {
        const result = allocateResources(
            allocation.id,
            allocation.type,
            allocation.amount,
            allocation.capacity,
            allocation.quantum,
        )
        expect(result.success).toBe(true)
      })
      
      expect(resourceAllocations.size).toBe(3)
    })
  })
  
  describe("execute-optimization-cycle", () => {
    it("should successfully execute optimization cycle", () => {
      const result = executeOptimizationCycle()
      
      expect(result.success).toBe(true)
      expect(result.cycles).toBe(1)
      expect(optimizationCycles).toBe(1)
      expect(globalEfficiencyScore).toBe(77) // Increased by 2
    })
    
    it("should handle multiple optimization cycles", () => {
      const cycleCount = 5
      
      for (let i = 0; i < cycleCount; i++) {
        const result = executeOptimizationCycle()
        expect(result.success).toBe(true)
        expect(result.cycles).toBe(i + 1)
      }
      
      expect(optimizationCycles).toBe(cycleCount)
      expect(globalEfficiencyScore).toBe(75 + cycleCount * 2)
    })
    
    it("should fail when called by non-owner", () => {
      const originalSender = mockTxSender
      mockTxSender = "ST2DIFFERENT_ADDRESS"
      
      const result = executeOptimizationCycle()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERR_OWNER_ONLY)
      
      mockTxSender = originalSender
    })
  })
  
  describe("get-metric", () => {
    it("should return metric details", () => {
      const metricId = "test-metric"
      registerMetric(metricId, "Test Metric", 80, 60, 90, OPTIMIZATION_BANDWIDTH)
      updateMetric(metricId, 75)
      
      const result = getMetric(metricId)
      
      expect(result).toBeDefined()
      expect(result.metricName).toBe("Test Metric")
      expect(result.currentValue).toBe(75)
      expect(result.targetValue).toBe(80)
    })
    
    it("should return undefined for non-existent metric", () => {
      const result = getMetric("non-existent")
      expect(result).toBeUndefined()
    })
  })
  
  describe("get-optimization-stats", () => {
    it("should return optimization statistics", () => {
      executeOptimizationCycle()
      executeOptimizationCycle()
      
      const stats = getOptimizationStats()
      
      expect(stats.globalEfficiency).toBe(79) // 75 + (2 * 2)
      expect(stats.optimizationCycles).toBe(2)
    })
  })
  
  describe("is-metric-optimal", () => {
    beforeEach(() => {
      registerMetric("test-metric", "Test Metric", 80, 60, 90, OPTIMIZATION_BANDWIDTH)
    })
    
    it("should return true for metric within thresholds", () => {
      updateMetric("test-metric", 75)
      const result = isMetricOptimal("test-metric")
      expect(result).toBe(true)
    })
    
    it("should return false for metric below threshold", () => {
      updateMetric("test-metric", 50)
      const result = isMetricOptimal("test-metric")
      expect(result).toBe(false)
    })
    
    it("should return false for metric above threshold", () => {
      updateMetric("test-metric", 95)
      const result = isMetricOptimal("test-metric")
      expect(result).toBe(false)
    })
    
    it("should return false for non-existent metric", () => {
      const result = isMetricOptimal("non-existent")
      expect(result).toBe(false)
    })
    
    it("should handle edge cases at threshold boundaries", () => {
      updateMetric("test-metric", 60) // At min threshold
      expect(isMetricOptimal("test-metric")).toBe(true)
      
      updateMetric("test-metric", 90) // At max threshold
      expect(isMetricOptimal("test-metric")).toBe(true)
      
      updateMetric("test-metric", 59) // Below min threshold
      expect(isMetricOptimal("test-metric")).toBe(false)
      
      updateMetric("test-metric", 91) // Above max threshold
      expect(isMetricOptimal("test-metric")).toBe(false)
    })
  })
  
  describe("quantum optimization features", () => {
    it("should provide higher efficiency for quantum-optimized resources", () => {
      allocateResources("quantum-resource", "quantum-processor", 500, 1000, true)
      allocateResources("classical-resource", "classical-processor", 500, 1000, false)
      
      const quantumAllocation = resourceAllocations.get("quantum-resource")
      const classicalAllocation = resourceAllocations.get("classical-resource")
      
      expect(quantumAllocation.efficiencyScore).toBe(95)
      expect(classicalAllocation.efficiencyScore).toBe(80)
      expect(quantumAllocation.efficiencyScore).toBeGreaterThan(classicalAllocation.efficiencyScore)
    })
    
    it("should handle quantum coherence optimization", () => {
      registerMetric("quantum-coherence", "Quantum Coherence Time", 95, 90, 99, OPTIMIZATION_QUANTUM_COHERENCE)
      updateMetric("quantum-coherence", 92)
      
      const metric = performanceMetrics.get("quantum-coherence")
      expect(metric.optimizationType).toBe(OPTIMIZATION_QUANTUM_COHERENCE)
      expect(isMetricOptimal("quantum-coherence")).toBe(true)
    })
  })
})

// Mock implementation functions
function registerMetric(metricId, metricName, targetValue, thresholdMin, thresholdMax, optimizationType) {
  if (mockTxSender !== "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM") {
    return { success: false, error: ERR_OWNER_ONLY }
  }
  
  if (thresholdMin >= thresholdMax) {
    return { success: false, error: ERR_INVALID_THRESHOLD }
  }
  
  const metric = {
    metricName,
    currentValue: 0,
    targetValue,
    thresholdMin,
    thresholdMax,
    optimizationType,
    lastMeasured: mockBlockHeight,
  }
  
  performanceMetrics.set(metricId, metric)
  return { success: true }
}

function updateMetric(metricId, newValue) {
  if (mockTxSender !== "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM") {
    return { success: false, error: ERR_OWNER_ONLY }
  }
  
  const metric = performanceMetrics.get(metricId)
  if (!metric) {
    return { success: false, error: ERR_METRIC_NOT_FOUND }
  }
  
  metric.currentValue = newValue
  metric.lastMeasured = mockBlockHeight
  performanceMetrics.set(metricId, metric)
  return { success: true }
}

function createOptimizationRule(ruleId, ruleName, triggerCondition, optimizationAction, priority, quantumEnhanced) {
  if (mockTxSender !== "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM") {
    return { success: false, error: ERR_OWNER_ONLY }
  }
  
  const rule = {
    ruleName,
    triggerCondition,
    optimizationAction,
    priority,
    quantumEnhanced,
    executionCount: 0,
  }
  
  optimizationRules.set(ruleId, rule)
  return { success: true }
}

function allocateResources(allocationId, resourceType, allocatedAmount, maxCapacity, quantumOptimized) {
  if (mockTxSender !== "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM") {
    return { success: false, error: ERR_OWNER_ONLY }
  }
  
  if (allocatedAmount > maxCapacity) {
    return { success: false, error: ERR_INVALID_THRESHOLD }
  }
  
  const efficiencyScore = quantumOptimized ? 95 : 80
  
  const allocation = {
    resourceType,
    allocatedAmount,
    maxCapacity,
    efficiencyScore,
    quantumOptimized,
  }
  
  resourceAllocations.set(allocationId, allocation)
  return { success: true }
}

function executeOptimizationCycle() {
  if (mockTxSender !== "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM") {
    return { success: false, error: ERR_OWNER_ONLY }
  }
  
  optimizationCycles += 1
  globalEfficiencyScore += 2
  
  return { success: true, cycles: optimizationCycles }
}

function getMetric(metricId) {
  return performanceMetrics.get(metricId)
}

function getOptimizationStats() {
  return {
    globalEfficiency: globalEfficiencyScore,
    optimizationCycles: optimizationCycles,
  }
}

function isMetricOptimal(metricId) {
  const metric = performanceMetrics.get(metricId)
  if (!metric) {
    return false
  }
  
  return metric.currentValue >= metric.thresholdMin && metric.currentValue <= metric.thresholdMax
}
