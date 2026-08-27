/**
 * codingInterviewService.js
 * AI Coding Interview Engine Service for ZenScore AI Product 6 (Sprint C).
 * Extended from baseAIService with 24h caching & telemetry under 'zenscore_ai_coding_interview_v1.1'.
 */

import { executeAIRequest } from './baseAIService'

export const CODING_INTERVIEW_PROMPT_VERSION = 'v1.1'

/**
 * Generates reliable fallback AI Coding Interview data if backend LLM is unreachable.
 */
export function generateCodingInterviewFallback(targetRole = 'Backend Engineer', payload = {}) {
  const { company = 'Amazon', language = 'Java' } = payload

  return {
    challenge: {
      title: 'Two Sum — Target Pair Discovery',
      company: company,
      difficulty: 'Easy',
      acceptanceRate: '54.2%',
      estimatedTime: '15 Mins',
      problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      inputFormat: 'Array of integers nums, integer target',
      outputFormat: 'Array of two integers representing 0-indexed positions',
      constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
      starterCode: {
        Java: 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write code here\n    return new int[]{};\n  }\n}',
        Python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write code here\n        pass',
        JavaScript: 'function twoSum(nums, target) {\n  // Write code here\n  return [];\n}',
        'C++': 'class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n  }\n};',
      },
    },
    testCaseResults: [
      { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]', actual: '[0, 1]', passed: true, isPublic: true },
      { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1, 2]', actual: '[1, 2]', passed: true, isPublic: true },
      { id: 3, input: 'nums = [3,3], target = 6', expected: '[0, 1]', actual: '[0, 1]', passed: true, isPublic: false },
    ],
    evaluation: {
      correctnessScore: 100,
      logicScore: 95,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      readabilityScore: 92,
      codeQuality: 'Optimal Solution using HashMap single-pass lookup',
    },
    aiDebugging: {
      hasBug: false,
      bugExplanation: 'No syntax or logic bugs detected in the submission.',
      correctedCode: '// Code is already optimal',
      bestPractice: 'Use HashMap to cache complement (target - num) for O(N) linear time lookup.',
    },
    optimalSolution: {
      javaCode: 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int diff = target - nums[i];\n      if (map.containsKey(diff)) {\n        return new int[]{ map.get(diff), i };\n      }\n      map.put(nums[i], i);\n    }\n    return new int[]{};\n  }\n}',
      explanation: 'Iterate through numbers while maintaining a HashMap storing value to index mapping. For each element, query target - nums[i] in O(1) time.',
    },
  }
}

/**
 * Fetches AI Coding Interview evaluation from backend API with 24h cache and fallback.
 */
export async function getAICodingInterview(targetRole = 'Backend Engineer', payload = {}) {
  const reqPayload = { targetCareer: targetRole, ...payload }
  const fallback = generateCodingInterviewFallback(targetRole, payload)
  const subKey = targetRole.replace(/\s+/g, '_')

  const result = await executeAIRequest({
    featureKey: 'coding_interview',
    cacheSubKey: subKey,
    promptVersion: CODING_INTERVIEW_PROMPT_VERSION,
    requestPayload: reqPayload,
    endpoint: '/careers/interview/coding-ai',
    requiredFields: [
      'challenge',
      'testCaseResults',
      'evaluation',
      'aiDebugging',
      'optimalSolution',
    ],
    fallbackData: fallback,
  })

  return {
    ...result.data,
    isCached: result.isCached,
    isFallback: result.isFallback,
  }
}

