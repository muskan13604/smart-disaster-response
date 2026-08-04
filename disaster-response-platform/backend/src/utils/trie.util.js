class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.data = null; // Store extra metadata (e.g. coordinates, type)
    }
}

class LocationTrie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, data) {
        let node = this.root;
        const normalizedWord = word.toLowerCase();
        
        for (let i = 0; i < normalizedWord.length; i++) {
            const char = normalizedWord[i];
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        // If multiple places have the same name, we can store an array. For simplicity, just store data.
        if (!node.data) node.data = [];
        node.data.push({ name: word, ...data });
    }

    searchPrefix(prefix) {
        let node = this.root;
        const normalizedPrefix = prefix.toLowerCase();
        
        for (let i = 0; i < normalizedPrefix.length; i++) {
            const char = normalizedPrefix[i];
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }

        return this._collectAllWords(node, []);
    }

    _collectAllWords(node, results, limit = 10) {
        if (results.length >= limit) return results;
        
        if (node.isEndOfWord) {
            results.push(...node.data);
        }

        for (const char in node.children) {
            this._collectAllWords(node.children[char], results, limit);
        }

        return results.slice(0, limit);
    }
}

// Singleton instance to hold locations in memory
const locationTrie = new LocationTrie();

// Pre-populate with mock data
const mockLocations = [
    { name: 'Mumbai', type: 'City', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', type: 'City', lat: 28.7041, lng: 77.1025 },
    { name: 'Bangalore', type: 'City', lat: 12.9716, lng: 77.5946 },
    { name: 'Relief Camp Alpha', type: 'Camp', lat: 19.1, lng: 72.9 },
    { name: 'City Hospital', type: 'Hospital', lat: 28.7, lng: 77.1 },
    { name: 'Pune', type: 'City', lat: 18.5204, lng: 73.8567 },
    { name: 'Patna', type: 'City', lat: 25.5941, lng: 85.1376 },
];

mockLocations.forEach(loc => locationTrie.insert(loc.name, loc));

module.exports = locationTrie;
