export class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }

    setData(data) {
        this.data = data
    }
    getData(){
        return this.data
    }
    setLeft(left) {
        this.left = left
    }
    getLeft(){
        return this.left
    }
    setRight(right) {
        this.right = right
    }
    getRight(){
        return this.right
    }
} 