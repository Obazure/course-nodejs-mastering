const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuid.v4()
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.toJSON())
        return Course.saveAll(courses)
    }

    static async saveAll(courses, callback) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
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

    static async getById(id) {
        const courses = await Course.getAll()
        return courses.find(c => c.id === id)
    }

    static async update(id, course) {
        const courses = await Course.getAll()
        const idx = courses.findIndex(c => c.id === id)
        courses[idx] = course
        return Course.saveAll(courses)
    }

    static async delete(id) {
        let courses = await Course.getAll()
        courses = courses.filter(c => c.id !== id)
        return Course.saveAll(courses)
    }
}

module.exports = Course