/**
 * codingChallengeService.js
 * Canonical Coding Challenge Registry for ZenScore AI (Product 6 - Sprint C).
 * Provides LeetCode/CodeSignal-grade coding questions with company tags, test cases, and starter code.
 */

export const CANONICAL_CODING_CHALLENGES = [
  {
    id: 'lc_1',
    title: 'Two Sum — Target Pair Discovery',
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Atlassian'],
    difficulty: 'Easy',
    acceptanceRate: '54.2%',
    estimatedTime: '15 Mins',
    category: 'DSA & Algorithms',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution, and you may not use the same element twice.',
    inputFormat: 'Array of integers nums, integer target',
    outputFormat: 'Array of two 0-indexed integers',
    constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ],
    starterCode: {
      Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
      Python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass`,
      JavaScript: `function twoSum(nums, target) {\n    // Write your solution here\n    return [];\n}`,
      'C++': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`
    }
  },
  {
    id: 'lc_146',
    title: 'LRU Cache Design',
    companyTags: ['Amazon', 'Google', 'Swiggy', 'PhonePe', 'Flipkart'],
    difficulty: 'Hard',
    acceptanceRate: '41.8%',
    estimatedTime: '35 Mins',
    category: 'System Design & DSA',
    problemStatement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache class with get(key) and put(key, value) in O(1) time complexity.',
    inputFormat: 'Operations and capacity arguments',
    outputFormat: 'Returned values for get calls',
    constraints: '1 <= capacity <= 3000, 0 <= key <= 10^4',
    examples: [
      { input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: '1, -1', explanation: 'Key 2 is evicted when key 3 is inserted.' }
    ],
    starterCode: {
      Java: `class LRUCache {\n    public LRUCache(int capacity) {\n        // Initialize cache\n    }\n    public int get(int key) {\n        return -1;\n    }\n    public void put(int key, int value) {\n    }\n}`,
      Python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass`,
      JavaScript: `class LRUCache {\n  constructor(capacity) {}\n  get(key) { return -1; }\n  put(key, value) {}\n}`,
      'C++': `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`
    }
  }
]

export function getCodingChallenges(companyFilter = 'Amazon') {
  return CANONICAL_CODING_CHALLENGES.filter(c => c.companyTags.includes(companyFilter)) || CANONICAL_CODING_CHALLENGES
}
