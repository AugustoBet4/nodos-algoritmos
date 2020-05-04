import { Variable } from "./Variable";

export class NorthWest {
    required = new Array();
    stock = new Array();
    cost = new Array();
    feasible = new Array();

    constructor(stockSize, requiredSize) {
        this.stockSize = stockSize;
        this.requiredSize = requiredSize;

        this.stock = new Array(stockSize);
        this.required = new Array(requiredSize);
        this.cost = this.createArray(stockSize, requiredSize);

        for(let i=0; i < (requiredSize + stockSize - 1); i++)
            this.feasible.push(new Variable());
    }
    setStock(value, index) {
        this.stock[index] = value;
    }
    setRequired(value, index) {
        this.required[index] = value;
    }
    setCost(value, stock, required) {
        this.cost[stock][required] = value;
    }

    maxNorthWest = () => {
        //var start = System.nanoTime();

        var min;        
        var k = 0; //feasible solutions counter
        
        //isSet is responsible for annotating cells that have been allocated
        var isSet = this.createArray(this.stockSize, this.requiredSize);        
        for (let j = 0; j < this.requiredSize; j++)
            for (let i = 0;  i < this.stockSize; i++)
                    isSet[i][j] = false;
        
        var i = 0, j = 0;
        var minCost = new Variable();
        
        //this will loop is responsible for candidating cells by their least cost
        while(k < (this.stockSize + this.requiredSize - 1)){
            
            minCost.setValue(Number.MIN_VALUE);													// HERE            
            //picking up the least cost cell          
            for (let m = 0;  m < this.stockSize; m++)
                for (let n = 0; n < this.requiredSize; n++)
                    if(!isSet[m][n])
                        if(this.cost[m][n] > minCost.getValue()){                                     //HERE
                            minCost.setStock(m);
                            minCost.setRequired(n);
                            minCost.setValue(this.cost[m][n]);
                        }            
            
            i = minCost.getStock();
            j = minCost.getRequired();  
            
            //allocating stock in the proper manner
            min = Math.max(this.required[j], this.stock[i]);												//HERE

            this.feasible[k].setRequired(j);
            this.feasible[k].setStock(i);
            this.feasible[k].setValue(min);
            k++;

            this.required[j] -= min;
            this.stock[i] -= min;
            console.log(this.cost)
            //allocating null values in the removed row/column
            if(this.stock[i] == 0)
                for(let l = 0; l < this.requiredSize; l++)
                    isSet[i][l] = true;                    
            else
                for(let l = 0; l < this.stockSize; l++)
                    isSet[l][j] = true;
        } 
        //return (System.nanoTime() - start) * 1.0e-9;
    }

    minNorthWest = () => {
        //var start = System.nanoTime();

        var min;        
        var k = 0; //feasible solutions counter
        
        //isSet is responsible for annotating cells that have been allocated
        var isSet = this.createArray(this.stockSize, this.requiredSize);        
        for (let j = 0; j < this.requiredSize; j++)
            for (let i = 0;  i < this.stockSize; i++)
                    isSet[i][j] = false;
        
        var i = 0, j = 0;
        var minCost = new Variable();
        
        //this will loop is responsible for candidating cells by their least cost
        while(k < (this.stockSize + this.requiredSize - 1)){
            
            minCost.setValue(Number.MAX_VALUE);													// HERE            
            //picking up the least cost cell          
            for (let m = 0;  m < this.stockSize; m++)
                for (let n = 0; n < this.requiredSize; n++)
                    if(!isSet[m][n])
                        if(this.cost[m][n] < minCost.getValue()){                                     //HERE
                            minCost.setStock(m);
                            minCost.setRequired(n);
                            minCost.setValue(this.cost[m][n]);
                        }            
            
            i = minCost.getStock();
            j = minCost.getRequired();  
            
            //allocating stock in the proper manner
            min = Math.min(this.required[j], this.stock[i]);												//HERE

            this.feasible[k].setRequired(j);
            this.feasible[k].setStock(i);
            this.feasible[k].setValue(min);
            k++;

            this.required[j] -= min;
            this.stock[i] -= min;
            
            //allocating null values in the removed row/column
            if(this.stock[i] == 0)
                for(let l = 0; l < this.requiredSize; l++)
                    isSet[i][l] = true;                    
            else
                for(let l = 0; l < this.stockSize; l++)
                    isSet[l][j] = true;

        } 
        //return (System.nanoTime() - start) * 1.0e-9;      
    }

    getSolution = () => {
        var result = 0;
        for(const x of this.feasible){
            result += x.getValue() * this.cost[x.getStock()][x.getRequired()];
        }
        return result;
    }


    createArray = (r, s) => {
        let newArray = new Array(r);
        for (let i = 0; i < r; i++) {
            newArray[i] = new Array(s);
        }
        return newArray;
    }
}