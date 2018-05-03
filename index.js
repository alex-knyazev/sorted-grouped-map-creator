import lodashGet from 'lodash.get';

class SortedGroupedMapCreator {
  constructor(data, key) {
    this.data = data;
    this.key = key;
    this.groupedMap = new Map();
    this.group = this.createGrouping(SortedGroupedMapCreator.defaultGrouping);
    this.sort = this.createSorting();
  }

  static defaultGrouping(dataItem, key) {
    return lodashGet(dataItem, key);
  }

  createGrouping(groupingFunction) {
    return () => {
      const { data, key, groupedMap } = this;
      const map = groupedMap;
      for (let i = 0; i < data.length; i += 1) {
        const element = data[i];
        if (map.has(groupingFunction(element, key))) {
          map.get(groupingFunction(element, key)).push(element);
        } else {
          map.set(groupingFunction(element, key), [element]);
        }
      }

      this.groupedMap = map;
    };
  }

  createSorting(sortFunction) {
    return () => {
      const { groupedMap } = this;
      this.groupedMap = new Map([...groupedMap.entries()].sort(sortFunction));
    };
  }

  setSortFunction(func) {
    this.sort = this.createSorting(func);
  }

  setGroupFunction(func) {
    this.group = this.createGrouping(func);
  }

  make() {
    this.group();
    this.sort();
    return this.groupedMap;
  }
}

export default SortedGroupedMapCreator;
