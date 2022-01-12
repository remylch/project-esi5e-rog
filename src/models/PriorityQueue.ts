class ElemQueue {
  constructor(private element: any, private priority: number) {
    this.element = element;
    this.priority = priority;
  }

  getPriority(): number {
    return this.priority;
  }
}

class PriorityQueue {
  constructor(private items: any[]) {}

  enqueue(item, priority): void {
    let elemQ = new ElemQueue(item, priority);
    let contain = false;

    this.items.forEach((item) => {
      if (this.items[item].priority > elemQ.getPriority()) {
        this.items.splice(item, 0, elemQ);
        contain = true;
        return;
      }
    });

    if (!contain) this.items.push(elemQ);
  }

  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow
    if (this.isEmpty()) return "List is empty";
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[0];
  }

  rear() {
    // returns the lowest priority
    // element of the queue
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0 ? true : false;
  }

  printPQueue(): string {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i].element + " ";
    return str;
  }
}

export default PriorityQueue;
