import { TileArray } from "./ai_2048";

class TreeNode {
    /**
     * 
     * @param {string} key 
     * @param {TileArray} value 
     * @param {TreeNode} parent 
     */
    constructor(key, value, parent = null) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        /**
         * @type {TreeNode[]}
         */
        this.children = [];
    }
    get isLeaf() {
        return this.children.length === 0;
    }
    get hasChildren() {
        return !this.isLeaf;
    }
    get isRoot() {
        return this.parent === null;
    }
}

export class Tree {
    /**
     * 
     * @param {string} key 
     * @param {TileArray} value 
     */
    constructor (key, value) {
        this.root = new TreeNode(key, value);
    }

    /**
     * 
     * @param {TreeNode} node 
     * @yields {TreeNode[]}
     * @returns {TreeNode[]}
     */
    *preOrderTraversal(node = this.root) {
        yield node;
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    /**
     * 
     * @param {string} parentNodeKey 
     * @param {string} key 
     * @param {TileArray} value 
     * @returns 
     */
    insert(parentNodeKey, key, value) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === parentNodeKey) {
                node.children.push(new TreeNode(key, value, node));
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * @param {string} key 
     * @returns 
     */
    remove(key) {
        for (let node of this.preOrderTraversal()) {
            const filtered = node.children.filter(c => c.key !== key);
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * @param {string} key 
     * @returns 
     */
    find(key) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }
}