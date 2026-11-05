/**
 * Normalize ingredient and item names for accurate matching.
 * Handles casing, whitespace, punctuation, and common singular/plural variations.
 */
function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';

  let normalized = name.toLowerCase().trim();

  // Remove special characters, brackets, extra symbols
  normalized = normalized.replace(/[^\w\s]/gi, ' ');
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Common culinary singular conversions
  const irregularPlurals = {
    tomatoes: 'tomato',
    potatoes: 'potato',
    chillies: 'chilli',
    chilis: 'chili',
    cloves: 'clove',
    berries: 'berry',
    leaves: 'leaf',
    loaves: 'loaf',
    halves: 'half',
    pieces: 'piece',
    bunches: 'bunch',
    branches: 'branch',
    capsicums: 'capsicum',
    onions: 'onion',
    lemons: 'lemon',
    eggs: 'egg',
    carrots: 'carrot',
    cucumbers: 'cucumber',
    mushrooms: 'mushroom',
    breads: 'bread',
    noodles: 'noodle',
    beans: 'bean',
    peas: 'pea',
    coriander_leaves: 'coriander',
    mint_leaves: 'mint',
    curry_leaves: 'curry leaf'
  };

  if (irregularPlurals[normalized]) {
    return irregularPlurals[normalized];
  }

  // General plural stripping: ending in 'ies' -> 'y' (e.g. strawberries -> strawberry)
  if (normalized.endsWith('ies') && normalized.length > 4) {
    return normalized.slice(0, -3) + 'y';
  }

  // ending in 'es' where root ends in s, x, z, ch, sh (e.g. dishes -> dish)
  if (normalized.endsWith('es') && normalized.length > 3) {
    const base = normalized.slice(0, -2);
    if (base.endsWith('sh') || base.endsWith('ch') || base.endsWith('s') || base.endsWith('x')) {
      return base;
    }
  }

  // regular 's' (e.g. carrots -> carrot, apples -> apple)
  if (normalized.endsWith('s') && !normalized.endsWith('ss') && normalized.length > 2) {
    return normalized.slice(0, -1);
  }

  return normalized;
}

module.exports = {
  normalizeName
};

