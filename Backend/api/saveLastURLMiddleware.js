//alapbol egy localstorage lett volna megoldas, de az sajnos nem utazik a request-ekben
function saveLastUrl(req, res, next) {
    //ingoraljuk ezeket a dolgokat hogy ezeknek a request-ere nem hivodjon meg ez a middleware
    const ignoredExtensions = [
        '.css',
        '.js',
        '.png',
        '.jpg',
        '.jpeg',
        '.svg',
        '.ico',
        '.woff',
        '.woff2',
        '.ttf',
        '.map'
    ];
    const isAsset = ignoredExtensions.some((ext) => req.originalUrl.endsWith(ext));
    //mivel ez a middleware weboldal betoltese soran tobbszor is lefut akaratlanul ezert az eredeti egy sutis megoldas, nem volt jo,
    //mert mindig felul lett irva, emiatt kell a 2 sutis megoldas
    //es ebben megoldasban nem hatra nezunk hanem, elore tehat csak elmentjuk a request-bol jovo URL es a tenyleges URL majd osszehasnonlitjuk oket
    if (!isAsset) {
        //ide megyunk
        const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const previousUrl = req.cookies.currentURL;

        if (previousUrl && previousUrl !== currentUrl) {
            res.cookie('lastURL', previousUrl, { sameSite: 'none', path: '/', secure: true });
        }

        res.cookie('currentURL', currentUrl, { sameSite: 'none', path: '/', secure: true });
    }

    next();
}
module.exports = saveLastUrl;
