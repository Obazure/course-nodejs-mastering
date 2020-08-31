const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const dataPath = path.join(
    path.dirname(process.mainModule.filename),
    'data', 'cart.json'
)

class Cart {
    constructor(courses, price) {
        this.courses = courses
        this.price = price
    }

    static async add(course) {
        const cart = await Cart.fetch()

        const idx = cart.courses.findIndex(c => c.id === course.id)
        const candidate = cart.courses[idx]

        if (candidate) {
            candidate.count++
            cart.courses[idx] = candidate
        } else {
            course.count = 1
            cart.courses.push(course)
        }

        cart.price += +course.price

        return Cart.save(cart)
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                dataPath,
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async save(cart) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                dataPath,
                JSON.stringify(cart),
                err => {
                    if (err)
                        reject(err)
                    else
                        resolve(cart)
                }
            )
        })
    }

    static async remove(id) {
        const cart = await Cart.fetch()
        const idx = cart.courses.findIndex(c => c.id === id)
        const course = cart.courses[idx]
        if (course.count === 1) {
            cart.courses = cart.courses.filter(c => c.id !== id)
        } else {
            cart.courses[idx].count--
        }
        cart.price -= course.price

        return await Cart.save(cart)
    }
}

module.exports = Cart