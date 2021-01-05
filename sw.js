//import
importScripts('js/sw-until.js')

const STATIC_CACHE = 'static-v3'
const DINAMIC_CACHE = 'dinamic-v2'
const INMUTABLE_CACHE = 'inmutable-v1'

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/ironman.jpg',
    'js/app.js'
]

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {

    console.log('cambio');

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => {
            return cache.addAll(APP_SHELL)
        })

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => {
            return cache.addAll(APP_SHELL_INMUTABLE)
        })

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]))

    self.skipWaiting()

})

self.addEventListener('activate', e => {

    const response = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(key !== STATIC_CACHE && key.includes('static')){
                    return caches.delete(key)
                }
                if(key !== DINAMIC_CACHE && key.includes('dinamic')){
                    return caches.delete(key)
                }
            })
        })

    e.waitUntil(response)

})

self.addEventListener('fetch', e => {

    const response  = caches.match(e.request)
        .then(res => {
            if(res) return res;
            else{
                return fetch( e.request )
                    .then(newResp => {
                        return actualizaCacheDinamico(DINAMIC_CACHE, e.request, newResp)
                    })
            }
        })


    e.respondWith(response)
})