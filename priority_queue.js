class PriorityQueue {
    constructor(){
        this.items = [];
    }

    enqueue(element){
        let contain = false;

        for(let i = 0; i < this.items.length; i++){
            if(this.items[i].fCost > element.fCost){
                this.items.splice(i, 0, element);
                contain = true;
                break;
            }
        }

        if(!contain){
            this.items.push(element);
        }
        
    }

    dequeue(){
        if(this.isEmpty())
            return null;
        return this.items.shift();
    }

    isEmpty(){
        return this.items.length === 0;
    }
}