class AdminController {
    index(req, res, next) {
        // res.send('Hello admin!')
        res.render('admin/index')
    }
}

module.exports = new AdminController()
