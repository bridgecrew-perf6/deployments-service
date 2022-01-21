/**
 * Find combinations of a specific size from a given array.
 *
 * The concept is simple when it is thought about recursively.
 *
 * Assuming the problem is solved for size K-1, To get all combinations of size K, one should extract a specific element and attach it to all combinations of size K-1.
 */
export default function combinations<T>(
  elements: T[],
  size: number,
  startIndex: number = 0
): T[][] {
  if (size === 0) {
    // The recursion won't reach this case, but it is in case the user
    // invokes with size of 0
    return [];
  }

  const ans = [];
  for (let index = startIndex; index < elements.length - size + 1; ++index) {
    const element = elements[index];

    if (size === 1) {
      ans.push([element]);
    } else {
      combinations(elements, size - 1, index + 1)
        .forEach(combination => ans.push([element, ...combination]));
    }
  }

  return ans;
}
