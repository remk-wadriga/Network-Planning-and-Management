export default class Stack {
   constructor () {
      this.index = 1
      this.stack = {}
   }

   addToStack (key, value) {
      if (this.stack[key] === undefined) {
          this.stack[key] = {}
      }
      let id = this.getID(value)
      if (this.stack[key][id] === undefined) {
          this.stack[key][id] = value
      }
   }

   getFromStack (key, id) {
       if (this.stack[key] === undefined) {
          this.stack[key] = {}
       }
       return this.stack[key][this.getID(id)]
   }

   getID (value) {
      let id = null
      switch (typeof value) {
          case 'object':
              if (value.id !== undefined) {
                  id = value.id
              }
              break;
          case 'string':
              if (value !== '' && value !== ' ') {
                  id = value
              }
              break;
          case 'number':
              if (value > 0) {
                  id = value
              }
              break;
          default:
              id = this.index++
              break;
      }
      return id
   }
}
