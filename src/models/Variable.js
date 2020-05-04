export class Variable {
    constructor(stock = 0, required = 0, value = 0) {
        this.stock = stock;
        this.required = required;
        this.value = value;
    }

    getStock(){
        return this.stock;
    }
    setStock(stock) {
        this.stock = stock;
    }
    getRequired(){
        return this.required;
    }
    setRequired(required) {
        this.required = required;
    }
    getValue(){
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }
    toString() {
        var string = "x["+this.stock+1+","+this.required+1+"]="+this.value+"";
        return string;
    }
}