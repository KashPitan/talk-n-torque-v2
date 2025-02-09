export const retryAssertion = async (
  assertion: () => Promise<void> | void,
  {
    maxAttempts = 5,
    initialDelay = 100,
    maxDelay = 5000,
    backoffFactor = 2,
  } = {}
): Promise<void> => {
  let attempts = 0;
  let delay = initialDelay;

  while (true) {
    try {
      console.log(`assertion attempt #${attempts + 1}`);
      await assertion();
      return; // Success! Exit the function
    } catch (error) {
      attempts++;

      if (attempts >= maxAttempts) {
        throw new Error(
          `Assertion failed after ${attempts} attempts: ${error}`
        );
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * backoffFactor, maxDelay);

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
