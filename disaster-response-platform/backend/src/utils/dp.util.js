/**
 * Resource Allocation Engine
 * Problem: We have limited resources (e.g., total budget/units). 
 * Each disaster requires a certain cost (resources) to handle, and provides a "value" (lives saved / coverage).
 * Objective: Maximize lives saved given the resource constraint.
 * Method: 0/1 Knapsack DP
 */
const allocateResourcesDP = (totalResources, disasters) => {
    // disasters array of objects: { id, requiredResources, livesSavedEstimate, name }
    const n = disasters.length;
    const dp = Array(n + 1).fill().map(() => Array(totalResources + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= totalResources; w++) {
            const d = disasters[i - 1];
            if (d.requiredResources <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - d.requiredResources] + d.livesSavedEstimate
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtrack to find which disasters were chosen
    let res = dp[n][totalResources];
    let w = totalResources;
    const allocatedDisasters = [];

    for (let i = n; i > 0 && res > 0; i--) {
        if (res !== dp[i - 1][w]) {
            const d = disasters[i - 1];
            allocatedDisasters.push(d);
            res -= d.livesSavedEstimate;
            w -= d.requiredResources;
        }
    }

    return {
        maxLivesSaved: dp[n][totalResources],
        allocatedDisasters,
        resourcesUsed: totalResources - w
    };
};

module.exports = { allocateResourcesDP };
