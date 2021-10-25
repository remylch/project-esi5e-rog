class Collection<T> {
  constructor(private items: T[]) {}

  add(item: T): this {
    this.items.push(item);
    return this;
  }

  first(): T | null {
    return this.items[0] || null;
  }

  last(): T | null {
    return this.items[this.items.length - 1] || null;
  }

  length(): number {
    return this.items.length;
  }

  isEqual(a: this): boolean {
    return a.items === this.items;
  }
}

export default Collection;
