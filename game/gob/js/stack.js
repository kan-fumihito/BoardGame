// Stack
class Stack
{
    constructor()
    {
        this._a = []
        this._size = 0
    }
    push(piece)
    {
        this._size++
        this._a.push(piece)
    }
    pop()
    {
        if(this._size > 0)
        {
            this._size--
            return this._a.pop()
        }
        return 0
    }
    get top()
    {
        if(this._size > 0)
            return this._a[this._size - 1]

        return 0
    }
    empty()
    {
        if(this._size == 0)
            return true

        return false
    }
}
