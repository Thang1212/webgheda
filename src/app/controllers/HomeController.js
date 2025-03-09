class HomeController {
    index(req, res, next) {
        // res.send('Hello home!')
        res.render('home')
    }
}

module.exports = new HomeController()
