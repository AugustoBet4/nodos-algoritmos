import { Node } from './NodeB';

export class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(data) {
        var newNode = new Node(data);
        if (this.root === null)
            this.root = newNode;
        else
            this.insertNode(this.root, newNode);
    }

    insertNode(node, newNode) {
        if (newNode.data !== node.data) {
            if (newNode.data < node.data) {
                if (node.left === null)
                    node.left = newNode;
                else
                    this.insertNode(node.left, newNode);
            }
            else {
                if (node.right === null)
                    node.right = newNode;
                else
                    this.insertNode(node.right, newNode);
            }
        }
    }

    remove(data) {
        this.root = this.removeNode(this.root, data);
    }

    removeNode(node, key) {
        if (node === null)
            return null;
        else if (key < node.data) {
            node.left = this.removeNode(node.left, key);
            return node;
        }
        else if (key > node.data) {
            node.right = this.removeNode(node.right, key);
            return node;
        }
        else {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            if (node.left === null) {
                node = node.right;
                return node;
            }

            else if (node.right === null) {
                node = node.left;
                return node;
            }
            var aux = this.findMinNode(node.right);
            node.data = aux.data;

            node.right = this.removeNode(node.right, aux.data);
            return node;
        }
    }

    findMinNode(node) {
        if (node.left === null)
            return node;
        else
            return this.findMinNode(node.left);
    }

    getRootNode() {
        return this.root;
    }

    search(node, data) {
        if (node === null)
            return null;
        else if (data < node.data)
            return this.search(node.left, data);
        else if (data > node.data)
            return this.search(node.right, data);
        else
            return node;
    }

    //METODOS DE BUSQUEDA
    bigInorder(node) {
        var orden = [];
        inorder(node)
        function inorder(node) {
            if (node !== null) {
                inorder(node.left);
                orden.push(node.data);
                inorder(node.right);
            }
        }
        return orden;
    }
    bigPreorder(node) {
        var orden = [];
        preorder(node);
        function preorder(node) {
            if (node !== null) {
                orden.push(node.data);
                preorder(node.left);
                preorder(node.right);
            }
        }
        return orden;
    }
    bigPostorder(node) {
        var orden = [];
        postorder(node)
        function postorder(node) {
            if (node !== null) {
                postorder(node.left);
                postorder(node.right);
                orden.push(node.data);
            }
        }
        return orden;
    }
}