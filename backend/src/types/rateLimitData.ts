/**
 * Obtain the rate limit data object to see how many points have been spent by this key.
 * @param limitPerHour The total amount of points this API key can spend per hour.
 * @param pointsSpentThisHour The total amount of points spent during this hour.
 * @param pointsResetIn The number of seconds remaining until the points reset.
 * @returns The rate limit data object.
 */
export type RateLimitData = {
    limitPerHour?: number
    pointsSpentThisHour?: number
    pointsResetIn?: number
}
