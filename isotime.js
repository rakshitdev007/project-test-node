function formatDate(timestamp) {
  return new Date(timestamp).toISOString();
}

// Usage
const isoString = formatDate(1766472579631);
console.log(isoString)